import "./src/view2"
import { IDependency, IRouteProvider } from "@/interface";
export class vieRegister2 extends IRouteProvider
{
    public getRoutes(): any[] {
        return [
            {
                path: 'view2',
                name: 'view2',
                component: () => import("./src/view2")
            }
        ];
    }
}