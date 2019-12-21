import { injectable, multiInject, decorate } from "inversify";
import { BlocksBoostrapper } from './bootstrapper';
import {
    IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component as vueComponent, Prop, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible
} from "./interface";
const TYPES = {
    BlocksModule: Symbol.for("BlocksModule"),

};
decorate(injectable(), BlocksModule);

let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = globalIocManager);


let Component = (options: any) => {
    var com = ComponentFactory(vueComponent, options);
    return typeof options === 'function' ? com : (options: any) => {
        var resultCom = ComponentFactory(vueComponent, options);
        return resultCom;
    };
}

function ComponentFactory(oldComponentFactory: any, options: any) {
   

    var com = oldComponentFactory(options);

    if (options && typeof options === 'function') {
        //componentPlugIns.setSource(args[0]);
        com.options.type = options;
    }

    return com;
}



export {
    TYPES, Bootstrapper, IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component, Prop, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible
}
