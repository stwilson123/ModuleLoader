import { IRouteProvider, RouteResult } from "@/interface";

export class module2RouteProvider extends IRouteProvider {
    constructor() {
        super();
    }
    getRoutes(): RouteResult[] {
        return [];
     } 
}