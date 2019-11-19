import { injectable, inject, multiInject, decorate } from "inversify";
import { BlocksBoostrapper } from './bootstrapper';
import { IDependency, IRouteProvider, Types, BlocksModule, IShell, ITemplateProvider, RouteResult, globalIocManager,IocManager,TemplateResult } from "./interface";
const TYPES = {
    BlocksModule: Symbol.for("BlocksModule"),

};
decorate(injectable(), BlocksModule);

let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = globalIocManager);

class RouteHelperCls {
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
        let routeObj = [];
        let templateProviders = Bootstrapper.iocManager.getAll<ITemplateProvider>(Types.ITemplateProvider);
        for (let routeProvider of Bootstrapper.iocManager.getAll<IRouteProvider>(Types.IRouteProvider)) {
            let moduleName = Bootstrapper.iocManager.get<IShell>(Types.IBlocksShell)
                .typeMapModuleName.get(routeProvider.constructor);
            let routes = routeProvider.getRoutes();
            if (!routes || !Array.isArray(routes))
                continue;
            let layoutRouteChilds:layoutRouteChild = {};
            for (const route of routes) {

                route.path = moduleName + "/" + route.path;
                if (route.uniqueKey) {
                    route.uniqueKey = route.uniqueKey + "_" + moduleName;
                    route.meta = Object.assign(true, route.meta, { uniqueKey: route.uniqueKey });
                }
                if (route.layout) {
                    layoutRouteChilds[route.layout] = layoutRouteChilds[route.layout] ? layoutRouteChilds[route.layout] : new RouteResult();
                    let tempRoute = layoutRouteChilds[route.layout];
                    for (const templateProvider of templateProviders) {
                        let template = templateProvider.getTemplate().find((t:TemplateResult) => t.name === route.layout);
                        if (template) {
                            tempRoute = Object.assign(tempRoute, template);
                            route.name = route.name ? route.name : route.uniqueKey;
                            tempRoute.children.push(route);
                            break;
                        }
                    }
                    if (tempRoute.children.length < 1)
                        routeObj.push(route);
                    continue;
                }
                if (!route.path.startsWith("/"))
                    route.path = "/" + route.path;
                routeObj.push(route);
            }
            for (let layoutRouteKey in layoutRouteChilds) {
                if (layoutRouteChilds.hasOwnProperty(layoutRouteKey)) {
                    const tempRoute = layoutRouteChilds[layoutRouteKey];
                    routeObj.push(Object.assign({}, tempRoute));
                }
            }


        }
        return routeObj;

    }
}

let RouteHelper = new RouteHelperCls();

interface layoutRouteChild {
    [key: string]: any,
}

export { TYPES, Bootstrapper, RouteHelper }
