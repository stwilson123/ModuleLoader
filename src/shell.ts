import { IBlocksShell, Types, IDependency, BlocksModule, IocManager } from "./interface"
import { Container, injectable, decorate, inject } from "inversify";
import { RouteStartupModule } from "./routes/routeStartupModule"
import { Component, Prop, Vue } from 'vue-property-decorator';
export class BlocksShell implements IBlocksShell {
    public pluginSource: any[] = [];
    public types: any[];
    public typeMapModuleName: Map<any, string>;
    typeMapFileName: Map<any, [boolean, string]>;
    public moduleMapTypes: Map<any, any[]>;
    iocManager: IocManager;
    constructor(
        @inject(IocManager) iocManager: IocManager) {
        this.iocManager = iocManager;
        this.types = [];
        this.typeMapModuleName = new Map<any, string>();
        this.moduleMapTypes = new Map<any, any[]>();
        this.typeMapFileName = new Map<any, [boolean, string]>();
    }


    public initialize() {
        for (let filesArray of this.getTypeFromFiles()) {
            this.moduleAndDependencyLoader(filesArray);
        }
        this.autoRegisterModule(RouteStartupModule);


        let startupModules = this.iocManager.getAll(BlocksModule);

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

        for (const module of startupModules) {
            if (!this.moduleMapTypes.has(module.constructor))
                continue;
            let moduleType = this.moduleMapTypes.get(module.constructor);
            if (!moduleType)
                continue;
            for (const type of moduleType) {
                this.typeMapModuleName.set(type, module.moduleName);
            }
        }

        Promise.all(startupModules.map(m => m.preInitialize())).then(p => {
            Promise.all(startupModules.map(m => m.initialize())).then(p1 => {

                return p1;

            });
            return p;
        })


    }

    private moduleAndDependencyLoader(filesArray: any) {
        let registerAction = (fileKey:any) => {
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
                decorate(injectable(), type);
            });

            return true;

        }
        return false

    }

    private getTypeFromFiles(): IterableIterator<any> {
        return this.pluginSource.values();
    }
}