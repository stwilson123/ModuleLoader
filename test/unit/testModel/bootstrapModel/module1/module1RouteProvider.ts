import { IRouteProvider,RouteResult } from "@/interface";

export class module1RouteProvider extends IRouteProvider {
    constructor() {
        super();
    }

    getRoutes(): RouteResult[] {
       return [];
    } 
}