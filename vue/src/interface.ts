import {} from "@blocks-framework/core";
import { Component } from './component';

import { Controller } from './controller';

import { Watch, Prop } from 'vue-property-decorator';
import { to } from "await-to-js";

export {
    IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, injectable, BlocksModule, Controller, Component, Prop, Watch, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible, IManifestProvider, decorateIfNoExist, to as catchWrap
}
