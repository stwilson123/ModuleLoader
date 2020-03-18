import "./src/view1"
import {  IDependency, IRouteProvider  } from "@/interface"
export class vieRegister1 extends IRouteProvider
{
    public getRoutes(): any[] {
        return [
            {
                path: 'view1',
                name: 'view1',
                component: () => import("./src/view1")
            }
        ];
    }
}