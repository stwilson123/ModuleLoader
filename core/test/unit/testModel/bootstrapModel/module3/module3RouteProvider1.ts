import {  IDependency, IRouteProvider  } from "@/interface"
export class module3RouteProvider1 extends IRouteProvider
{
    public getRoutes(): any[] {
        return [
            {
                path: 'view1',
                name: 'view1',
                layout: "layout"
            }
        ];
    }
}