import { Types } from "./Types";
import { injectable, inject ,IocManager} from "./ioc/iocManager"
import { IDependency,IBlocksShell,IBootstrapper,IShell,BlocksModule,globalIocManager } from "./core/abstract";
import { IRouteProvider, ITemplateProvider, RouteResult, TemplateResult } from './routes/abstract';
import { Vue, Component, Watch, Prop,Controller } from './vue/interface';
 








 
//let startupModule = startupModuleDefine;
//  let IDependency = IDependencyDefine;
// this.Interface = {
//     startupModule, IDependency, IShell, IRouteProvider, ITemplateProvider, Types,
//     inject, BlocksModule, Controller, Component, RouteResult, TemplateResult, globalIocManager,IBootstrapper
// }  



function asyncCompatible() {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        let originFunc = descriptor.value;
        descriptor.value = function (...param: any[]) {
            let paramLength = param.length;
            //debugger;
            let actParam = paramLength > 1 ? param.slice(0, paramLength) : param;
            let p: Function = paramLength > 0 ? param[paramLength - 1] : null;
            let returnObj = originFunc.call(this, ...actParam);
            let hasThen = true;
            try {
                hasThen = returnObj.then !== "undefined";
            } catch (error) {
                hasThen = false;
            }
            if (hasThen) {
                returnObj.then((r: any) => {
                    p && p(r);
                }).catch((r: any) => {
                    console.log(r)
                    p && p();
                });
            }
            else {
                p && p(returnObj);
            }

        }

    }
}
 
export {
     IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject,injectable, BlocksModule, Controller, Component, Prop,Watch, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible
}
