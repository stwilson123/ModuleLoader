import { Types } from "./Types";
import { injectable, inject, IocManager } from "./ioc/iocManager"
import { IDependency, IBlocksShell, IBootstrapper, IShell, BlocksModule /*, globalIocManager*/ } from "./core/abstract";
import { IRouteProvider, ITemplateProvider, RouteResult, TemplateResult } from './routes/abstract';

import { IManifestProvider } from "@/manifest/abstract";
import { decorateIfNoExist } from "./ioc/decorate";


export {
    IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, injectable, BlocksModule, RouteResult, TemplateResult,/* globalIocManager,*/ IBootstrapper, IocManager,
    IManifestProvider,decorateIfNoExist
}
