import { IBlocksShell, IDependency, BlocksModule } from "./abstract"
import { Container, injectable, decorate, inject } from "inversify";
import { RouteStartupModule } from "@/routes/routeStartupModule"
import { decorateIfNoExist } from "@/ioc/decorate";
import { IocManager } from "@/ioc/iocManager";
import { typeCheckExpression } from "./loaderExtensions";
import { manifestStartupModule } from "@/manifest/manifestStartupModule"



export class BlocksShell implements IBlocksShell {
    public pluginSource: any[] = [];
    public types: any[];
    public typeMapModuleName: Map<any, string>;
    typeMapFileName: Map<any, [boolean, string]>;
    public moduleMapTypes: Map<any, any[]>;
    iocManager: IocManager;
    blocksModules: BlocksModule[];
    constructor(
        @inject(IocManager) iocManager: IocManager) {
        this.iocManager = iocManager;
        this.types = [];
        this.typeMapModuleName = new Map<any, string>();
        this.moduleMapTypes = new Map<any, any[]>();
        this.typeMapFileName = new Map<any, [boolean, string]>();
        this.blocksModules = [];
    }
    get BlocksModules(): BlocksModule[] {
        return this.blocksModules;
    }

    public async initialize() {
        for (let filesArray of this.getTypeFromFiles()) {
            this.moduleAndDependencyLoader(filesArray);
        }
        this.autoRegisterModule(RouteStartupModule);
        this.autoRegisterModule(manifestStartupModule);


        let startupModules = this.iocManager.getAll(BlocksModule);
        this.blocksModules = startupModules;
        //
        let temp = new Map<string, []>();
        for (let module of startupModules) {
            if (temp.has(module.moduleName))
                throw new Error(`ModuleName ${module.moduleName} is registered double.`)
            temp.set(module.moduleName, []);
        }

        // for (let module of startupModules) {
        //     if (this.ModuleMapTypes.has(module.ModuleName))
        //         throw new Error(`ModuleName {ModuleName} is registered double.`)
        //     this.ModuleMapTypes.set(module.ModuleName, []);
        // }

        this.moduleMapTypes.forEach((moduleMapSet, moduleTypeKey) => {
            let moduleType = this.typeMapFileName.get(moduleTypeKey);
            if (!moduleType)
                return;
            let moduleFilePrefix = moduleType[1];
            moduleFilePrefix = moduleFilePrefix.substring(0, moduleFilePrefix.lastIndexOf('/') + 1);
            this.typeMapFileName.forEach((value, typeMapKey) => {
                if (value[1].startsWith(moduleFilePrefix)) {
                    moduleMapSet.push(typeMapKey);
                }
            });
        });

        for (const startupModule of startupModules) {
            if (!this.moduleMapTypes.has(startupModule.constructor))
                continue;
            let moduleType = this.moduleMapTypes.get(startupModule.constructor);
            if (!moduleType)
                continue;
            for (const type of moduleType) {
                this.typeMapModuleName.set(type, startupModule.moduleName);
            }
        }

        let orders = startupModules.map(m => m.order).reduce((cur, next) => {
            if (!cur.includes(next))
                cur.push(next);
            return cur;
        }, new Array<number>()).sort((a, b) => a - b);

        let orderGroup = orders.reduce((cur, next) => {
            cur.push(startupModules.filter(m => m.order === next));
            return cur;
        }, new Array<Array<BlocksModule>>())


        for (const orderModules of orderGroup) {
            await Promise.all(orderModules.map(m => m.preInitialize()));
        }

        for (const orderModules of orderGroup) {
            await Promise.all(orderModules.map(m => m.initialize()));

        }

    }

    private moduleAndDependencyLoader(filesArray: any) {
        let registerAction = (fileKey: any) => {
            let exportTypes = filesArray(fileKey);
            for (let objKey of Object.keys(exportTypes)) {
                let exportType = exportTypes[objKey];
                if (!exportType)
                    continue;
                let isModule = this.autoRegisterModule(exportType);
                if (isModule)
                    this.moduleMapTypes.set(exportType, []);
                if (exportType.prototype instanceof IDependency) {
                    this.typeMapFileName.set(exportType, [isModule, fileKey]);
                    this.types.push(exportTypes[objKey]);
                }
                for (const checkExppression of typeCheckExpression) {
                    let type = checkExppression(exportType);
                    if (type) {
                        this.typeMapFileName.set(type, [isModule, fileKey]);
                        this.types.push(type);
                        break;
                    }
                }
                // if (exportType.prototype instanceof Controller && exportType.options.type) {
                //     this.typeMapFileName.set(exportType.options.type, [isModule, fileKey]);
                //     this.types.push(exportType.options.type);
                // }
                // if(fileKey.lastIndexOf(".bl.ts"))
                // {
                //     debugger
                //     decorate(Component(), exportType);
                // }
            }
        };


        for (let fileKey of filesArray.keys()) {
            registerAction(fileKey)
        }


    }

    private autoRegisterModule(type: any): boolean {

        if (type.prototype instanceof BlocksModule) {

            this.iocManager.register((c: Container) => {
                c.bind(BlocksModule).to(type).inTransientScope();
                decorateIfNoExist(injectable(), type);
            });

            return true;

        }
        return false

    }

    private getTypeFromFiles(): IterableIterator<any> {
        return this.pluginSource.values();
    }
}