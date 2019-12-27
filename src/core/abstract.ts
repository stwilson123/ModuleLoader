
import { injectable, inject } from "inversify"
import { IocManager } from "@/ioc/iocManager";
import { Types } from "@/Types";
import { Component, Watch, Prop, Vue } from '@/vue/interface';
let _win: any = window;
let globalIocManager: IocManager = _win["globalIocManager"] || new IocManager();
_win["globalIocManager"] = globalIocManager;


@injectable()
class IDependency {

}

class IBlocksShell {
    pluginSource?: any[];
    initialize(): void {
        throw new Error("initialize is not implemented. ")

    }
    types: any[] = [];
    typeMapModuleName: Map<any, string> = new Map<any, string>();
    moduleMapTypes: Map<any, any[]> = new Map<any, any[]>();
    get BlocksModules(): BlocksModule[] {
        throw new Error("initialize is not implemented. ")
    }
}
class IBootstrapper {
    get PlugInSources(): any {
        throw new Error("plugInSources is not implemented. ")
    }
    initialize() {
        throw new Error("initialize is not implemented. ")
    }

    dispose()
    {
        throw new Error("dispose is not implemented. ")
    }

}
class startupModuleDefine extends IDependency {
    readonly moduleName: string = "";
    getProviders(): any[] {
        throw new Error("getProviders is not implemented.")
    }
}



class IShell extends IDependency {
    pluginSource: any[] = [];
    types: any[] = [];
    initialize(): void {

    }
    moduleMapTypes: Map<any, any[]> = new Map<any, any[]>();
    typeMapModuleName: Map<any, string> = new Map<any, string>();
}



class BlocksModule extends IDependency {
    @inject(IocManager)
    iocManager?: IocManager;
    //TODO Need to SortModule??
    order = 10;

    providers: () => any[] = () => [];
    public readonly moduleName: string = "default";
    constructor() {
        super();
    }

    public async preInitialize() {
        // let tsContext = require.context("./", true);

        // this.iocManager.RegisterModuleByConvention(this.providers);
    }

    public async initialize() {

    }

    public getProviders(): any[] {
        return this.providers();
    }

    public async dispose()
    {
        
    }

}




export { IDependency,IBlocksShell,IBootstrapper,IShell,BlocksModule,globalIocManager }