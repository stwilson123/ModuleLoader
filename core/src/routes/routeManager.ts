import { IRouteManager, IRouteProvider, ITemplateProvider, layoutRouteChild, RouteResult, TemplateResult } from "@/routes/abstract";
import { IocManager, inject, injectable } from '@/ioc/iocManager';
import { IShell } from './../core/abstract';
import { Types } from './../Types';
export default class RouteManager implements IRouteManager {
    private iocManager: IocManager;

    public static getUniqueKey = (moduleName: String | undefined, uniqueKey: String): string => uniqueKey + "_" + moduleName;

    constructor(@inject(IocManager) IocManager: IocManager) {
        this.iocManager = IocManager;
    }
    getUniquePath(): any[] {
        let routes = this.getRoute();
        let routePaths = [];
        for (const route of routes) {
            if (!route.children) {
                routePaths.push(Object.assign(true, {}, route, { meta: { uniqueKey: route.uniqueKey } }));
                continue;
            }
            for (let routeChild of route.children) {

                if (!routeChild.children) {
                    routePaths.push(Object.assign(true, routeChild, { path: route.path + "/" + routeChild.path, meta: { uniqueKey: routeChild.uniqueKey } }));
                    continue;
                }
                for (const routeChildTemp of routeChild.children) {
                    if (!routeChildTemp.children) {
                        routePaths.push(Object.assign(true, routeChild, { path: route.path + "/" + routeChild.path + "/" + routeChildTemp.path, meta: { uniqueKey: routeChildTemp.uniqueKey } }))
                        continue;
                    }
                }
            }
        }
        return routePaths;
    }



    public getRoute(): any[] {
        let routeObj: any[] = [];
        let templateProviders = this.iocManager.isRegistered(Types.ITemplateProvider) ? this.iocManager.getAll<ITemplateProvider>(Types.ITemplateProvider) : [];
        if (!this.iocManager.isRegistered(Types.IRouteProvider))
            return routeObj;
        let layoutRouteChilds: layoutRouteChild = {};
        for (let routeProvider of this.iocManager.getAll<IRouteProvider>(Types.IRouteProvider)) {
            let moduleName = this.iocManager.get<IShell>(Types.IBlocksShell)
                .typeMapModuleName.get(routeProvider.constructor);
            let routes = routeProvider.getRoutes();
            if (!routes || !Array.isArray(routes))
                continue;

            for (const route of routes) {

                route.path = moduleName + "/" + route.path;
                if (route.uniqueKey) {
                    route.uniqueKey = RouteManager.getUniqueKey(moduleName, route.uniqueKey); //  route.uniqueKey + "_" + moduleName;
                    route.meta = Object.assign(true, route.meta, { uniqueKey: route.uniqueKey });
                }
                if (route.layout) {
                    let tempRoute = layoutRouteChilds[route.layout];
                    if(tempRoute === undefined)
                    {
                        for (const templateProvider of templateProviders) {
                            let template = templateProvider.getTemplate().find((t: TemplateResult) => t.name === route.layout);
                            if (template) {
                                tempRoute = Object.assign(new RouteResult(), template);
                                break;
                            }
                        }
                    }
                    layoutRouteChilds[route.layout] = tempRoute;
                   
                    route.name = route.name ? route.name : route.uniqueKey;
                    tempRoute.children.push(route);
                    if (tempRoute.children.length < 1)
                        routeObj.push(route);
                    continue;
                }
                if (!route.path.startsWith("/"))
                    route.path = "/" + route.path;
                routeObj.push(route);
            }

        }
        for (let layoutRouteKey in layoutRouteChilds) {
            if (layoutRouteChilds.hasOwnProperty(layoutRouteKey)) {
                const tempRoute = layoutRouteChilds[layoutRouteKey];
                routeObj.push(Object.assign({}, tempRoute));
            }
        }
        return routeObj;

    }



}
