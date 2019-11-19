import { injectable, inject } from "inversify"
import { IocManager } from "./ioc/iocManager";
import { Component, Vue, Watch } from 'vue-property-decorator';

let _win:any = window;
let globalIocManager = _win["globalIocManager"] || new IocManager();
_win["globalIocManager"] = globalIocManager;
@injectable()
class IDependency {

}

class IBlocksShell{
    pluginSource?: any[];
    initialize():void 
    {

    }
}
class IBootstrapper {
    get PlugInSources():any
    {
        throw new Error("Not ")
    }
    initialize()
    {

    }
}
class startupModuleDefine extends IDependency {
    readonly moduleName: string = "";
    getProviders(): any[]
    {
        throw new Error("getProviders is not implemented.")
    }
}



class IShell extends IDependency {
    pluginSource: any[] = [];
    types: any[] = [];
    initialize(): void
    {

    }
    moduleMapTypes: Map<any, any[]> = new Map<any, any[]>();
    typeMapModuleName: Map<any, string> = new Map<any,string>();
}


class IRouteProvider extends IDependency {
    getRoutes(): RouteResult[]
    {
        throw new Error("getRoutes is not implemented.")
    }
}

class ITemplateProvider extends IDependency {
    getTemplate(): TemplateResult[]
    {
        throw new Error("getTemplate is not implemented.")
    }
}

class RouteResult {
    layout: string = "";
    name?: string;
    path: string = "";
    component: any | string;
    components: any[] = [];
    children: RouteResult[];
    uniqueKey?: string;
    constructor() {
        this.children = [];
    }
    meta:any;
}

class TemplateResult {
    layout?: string;
    name?: string;
    path?: string;
    component: any | string;
    components?: any[];
    children?: RouteResult[];

}

const Types = {

    IBlocksShell: Symbol.for("IBlocksShell"),
    IRouteProvider: Symbol.for("IRouteProvider"),
    ITemplateProvider: Symbol.for("ITemplateProvider"),
    IBootstrapper: Symbol.for("IBootstrapper")
}


class BlocksModule extends IDependency {
    providers: () => any[] = () => [];
    //TODO Need to SortModule??
    order = 10;
    @inject(IocManager)
    iocManager?: IocManager;
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

}


@Component({})
class Controller extends Vue {
    constructor() {
        super()
    }
    viewWillEnterResult: any;
    viewAnimationEndTime: any;
    created() {
        this.viewWillEnterResult = this.viewWillEnter();
        console.debug("assign viewWillEnterResult")
    }
    async mounted() {
        if (isPromise(this.viewDidEnter))
            await this.viewDidEnter();
        else
            this.viewDidEnter();
        this.viewAnimationEndTime = setTimeout(() => {
            this.viewAnimationEnd();
        }, 800);
    }

    viewAnimationEndAndDataReady() {

    }
    async viewAnimationEnd() {
        console.debug("viewAnimationEnd start")
        clearTimeout(this.viewAnimationEndTime)
        if (isPromise(this.viewWillEnterResult)) {
            await this.viewWillEnterResult;
            console.debug("await  viewWillEnterResult")
        }
        console.debug("viewWillEnterResult end")
        if (isPromise(this.viewAnimationEndAndDataReady))
            await this.viewAnimationEndAndDataReady()
        else
            this.viewAnimationEndAndDataReady()
        console.debug("viewAnimationEndAndDataReady end")
        // this.$emit("viewDataReadyFinish")
        let _this:any = this;
        _this.$emit("viewDataReadyFinish");

        _this.$nextTick(async () => {
            let allCom = _this.$el.querySelectorAll(".vue-recycle-scroller__item-view");
            for (const com of allCom) {
                let comChild = com.firstElementChild;
                if (comChild && comChild.componentOnReady)
                    await comChild.componentOnReady();
            }
            _this.$emit("viewReaderFinish");
        })
    }
    viewWillEnter() {

    }
    viewDidEnter() {

    }
}

function isPromise(obj:any) {

    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';

}
let startupModule = startupModuleDefine;
//  let IDependency = IDependencyDefine;
// this.Interface = {
//     startupModule, IDependency, IShell, IRouteProvider, ITemplateProvider, Types,
//     inject, BlocksModule, Controller, Component, RouteResult, TemplateResult, globalIocManager,IBootstrapper
// }  



function asyncCompatible() {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        let originFunc = descriptor.value;
        descriptor.value = function (...param: any[]) {
            let paramLength = param.length;
            //debugger;
            let actParam = paramLength > 1 ? param.slice(0, paramLength) : param;
            let p: Function = paramLength > 0 ? param[paramLength - 1] : null;
            let returnObj = originFunc.call(this, ...actParam);
            let hasThen = true;
            try {
                hasThen = returnObj.then !== "undefined";
            } catch (error) {
                hasThen = false;
            }
            if (hasThen) {
                returnObj.then((r:any) => {
                    p && p(r);
                }).catch((r:any) => {
                    console.log(r)
                    p && p();
                });
            }
            else {
                p && p(returnObj);
            }

        }

    }
}
export {
    startupModule, IDependency, IShell, IRouteProvider, ITemplateProvider, Types, IBlocksShell,
    inject, BlocksModule, Controller, Component, RouteResult, TemplateResult, globalIocManager, IBootstrapper, IocManager,
    asyncCompatible
}
