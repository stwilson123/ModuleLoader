import { IRouteProvider, RouteResult } from "@/index";

export class module2RouteProvider extends IRouteProvider {
    constructor() {
        super();
    }
    getRoutes(): RouteResult[] {
        return [];
     } 
}