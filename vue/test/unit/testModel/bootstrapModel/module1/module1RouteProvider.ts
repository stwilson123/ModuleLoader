import { IRouteProvider,RouteResult } from "@/index";

export class module1RouteProvider extends IRouteProvider {
    constructor() {
        super();
    }

    getRoutes(): RouteResult[] {
       return [];
    } 
}