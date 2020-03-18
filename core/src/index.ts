import { injectable, multiInject, decorate } from "inversify";
import { BlocksBoostrapper } from './core/bootstrapper';
import {
    IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, RouteResult, TemplateResult, /* globalIocManager,*/ IBootstrapper, IocManager,
    IManifestProvider, decorateIfNoExist
} from "./interface";

// const TYPES = {
//     BlocksModule: Symbol.for("BlocksModule"),

// };
decorate(injectable(), BlocksModule);

let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = new IocManager());



export {
    Types, Bootstrapper, IDependency, IShell, IRouteProvider, ITemplateProvider, IBlocksShell,
    inject, injectable, BlocksModule, RouteResult, TemplateResult, /*globalIocManager,*/ IBootstrapper, IocManager,BlocksBoostrapper,
    IManifestProvider,decorateIfNoExist
}
