import { IDependency } from "@/core/abstract";
class IRouteProvider extends IDependency {
    getRoutes(): RouteResult[] {
        throw new Error("getRoutes is not implemented.")
    }
}

class ITemplateProvider extends IDependency {
    getTemplate(): TemplateResult[] {
        throw new Error("getTemplate is not implemented.")
    }
}

class RouteResult {
    layout: string = "";
    name?: string;
    path: string = "";
    component: any | string;
    components?: any[];
    children: RouteResult[];
    uniqueKey?: string;
    constructor() {
        this.children = [];
    }
    meta: any;
}

class TemplateResult {
    layout?: string;
    name?: string;
    path?: string;
    component: any | string;
    components?: any[];
    children?: RouteResult[];

}

interface IRouteManager
{
    getUniquePath(): any[];
    getRoute(): any[];
}

interface layoutRouteChild {
    [key: string]: any,
}
export { IRouteProvider, ITemplateProvider, RouteResult, TemplateResult, IRouteManager,layoutRouteChild }