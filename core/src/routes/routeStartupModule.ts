import { Types } from "@/Types";
import { IRouteProvider, ITemplateProvider, IRouteManager } from "./abstract"
import { IocManager, inject, injectable } from '@/ioc/iocManager';
import { Container } from "inversify";
import { BlocksModule, IShell, } from "@/core/abstract";
import DefaultRouteManager from "@/routes/RouteManager"

import { decorateIfNoExist } from "@/ioc/decorate";
export class RouteStartupModule extends BlocksModule {
    @inject(Types.IBlocksShell)
    shell?: IShell;
    public moduleName: string = "RouteStartupModule";
    constructor() {
        super();
    }
    public async preInitialize() {
        if (!this.shell)
            throw new Error("Shell is null or empty.")
        if (!this.iocManager)
            throw new Error("iocManager is null or empty.")
        let iocManagerTmp = this.iocManager;

        iocManagerTmp.register((c: Container) => {
            //hahhahaahahah
            debugger
            c.bind<IRouteManager>(Types.IRouteManager).to(DefaultRouteManager).inSingletonScope();
            decorateIfNoExist(injectable(), DefaultRouteManager);
        });
        this.shell.moduleMapTypes.forEach((typeMap, ModuleType) => {
            typeMap.forEach((type, index) => {

                if (type.prototype instanceof IRouteProvider) {
                    iocManagerTmp.register((c: Container) => {
                        c.bind<IRouteProvider>(Types.IRouteProvider).to(type).inTransientScope();
                    });
                }
                if (type.prototype instanceof ITemplateProvider) {
                    iocManagerTmp.register((c: Container) => {
                        c.bind<ITemplateProvider>(Types.ITemplateProvider).to(type).inTransientScope();
                    });
                }
            });

        });

    }
}