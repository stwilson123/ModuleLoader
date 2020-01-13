import { injectable, multiInject, decorate } from "inversify";
import { BlocksBoostrapper } from './core/bootstrapper';
import {
    IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component, Prop, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible,IManifestProvider
} from "./interface";

import { to  } from "await-to-js";
const TYPES = {
    BlocksModule: Symbol.for("BlocksModule"),

};
decorate(injectable(), BlocksModule);

let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = globalIocManager);



export {
    TYPES, Bootstrapper, IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component, Prop, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible,IManifestProvider, to as catchWrap
}
