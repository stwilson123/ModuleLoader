import { injectable, multiInject, decorate } from "inversify";
import { BlocksBoostrapper } from './bootstrapper';
import { IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component, Prop, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible } from "./interface";
const TYPES = {
    BlocksModule: Symbol.for("BlocksModule"),

};
decorate(injectable(), BlocksModule);

let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = globalIocManager);





export { TYPES, Bootstrapper,IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component, Prop, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible }
