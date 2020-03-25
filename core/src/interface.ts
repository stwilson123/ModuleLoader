import { Types } from "./Types";
import { injectable, inject, IocManager } from "./ioc/iocManager"
// import { IDependency, IBlocksShell, IBootstrapper, IShell, BlocksModule /*, globalIocManager*/ } from "./core/abstract";
import { IDependency, IBlocksShell, IBootstrapper, IShell, BlocksModule /*, globalIocManager*/ } from "./core/abstract";

import { IRouteProvider,IRouteManager, ITemplateProvider, RouteResult, TemplateResult,getUniqueKey } from './routes/abstract';

import { IManifestProvider,IResourceManager,ResourceManifestBuilder,getResourceKey } from "./manifest/abstract";
import { decorateIfNoExist } from "./ioc/decorate";
import { typeCheckExpression } from "./core/loaderExtensions";

export {
    IDependency, IShell, IRouteProvider,IRouteManager,getUniqueKey, ITemplateProvider, Types, IBlocksShell,
    inject, injectable, BlocksModule, RouteResult, TemplateResult,/* globalIocManager,*/ IBootstrapper, IocManager,
    IManifestProvider,IResourceManager,ResourceManifestBuilder,getResourceKey,decorateIfNoExist,typeCheckExpression
}
