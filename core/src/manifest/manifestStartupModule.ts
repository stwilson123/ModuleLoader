import { Types } from "./../Types";
import { IManifestProvider, IResourceManager } from "./abstract";
import { resourceManager } from "./resourceManager";
import { inject, injectable } from "../ioc/iocManager"
import { decorateIfNoExist } from "./../ioc/decorate";
import { Container } from "inversify";
import { BlocksModule, IShell, } from "./../core/abstract";

export class manifestStartupModule extends BlocksModule {
    @inject(Types.IBlocksShell)
    shell?: IShell;
    public moduleName: string = "ManifestStartupModule";
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
            c.bind<IResourceManager>(Types.IResourceManager).to(resourceManager).inSingletonScope();
            decorateIfNoExist(injectable(), resourceManager);
        });


        this.shell.moduleMapTypes.forEach((typeMap, ModuleType) => {
            typeMap.forEach((type, index) => {
                if (type.prototype instanceof IManifestProvider) {
                    iocManagerTmp.register((c: Container) => {
                        c.bind<IManifestProvider>(Types.IManifestProvider).to(type).inTransientScope();
                    });
                }
            });

        });

    }
}