import Vue from 'vue'
import { IBlocksShell, globalIocManager } from '../core/abstract';
import { Component as vueComponent, Watch, Prop } from 'vue-property-decorator';
import { Types } from "@/Types";
import { isPromise } from "@/utility/helper";
import { IResourceManager } from '@/manifest/abstract';
import { resourceManager as defaultResourceManager } from "@/manifest/resourceManager";
declare module 'vue/types/options' {

    interface ComponentOptions<V extends Vue> {
        type?: Object
    }
}

@vueComponent({})
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
        let _this: any = this;
        _this.$emit("viewDataReadyFinish");

        _this.$nextTick(async () => {
            if (_this.$el.querySelectorAll) {
                let allCom = _this.$el.querySelectorAll(".vue-recycle-scroller__item-view");
                for (const com of allCom) {
                    let comChild = com.firstElementChild;
                    if (comChild && comChild.componentOnReady)
                        await comChild.componentOnReady();
                }

            }

            _this.$emit("viewReaderFinish");
        })
    }
    viewWillEnter() {

    }
    viewDidEnter() {

    }

    exit(...args: any[]) {
        this.$emit("exit", ...args)
    }
    getModuleName() {
        let shell = globalIocManager.get<IBlocksShell>(Types.IBlocksShell);
        let moduleName = shell.typeMapModuleName.get(this.$options.type);
        if (moduleName === undefined)
            throw new Error(this + " not belong to framework.")
        return moduleName;
    }

    getResources(resourceType: string, resourceName: string) {
        debugger
        let moduleName = this.getModuleName();
        let resourceManager = globalIocManager.get<IResourceManager>(Types.IResourceManager);
        let resourceDef = resourceManager.getResource(moduleName, resourceType, resourceName);
        if (resourceDef === undefined)
            throw new Error(`Can not found resourceType:${resourceType}, resourceName:${resourceName} in resources.`)
        return resourceDef.resource;
    }



}

let Component = (options: any) => {
    var com = ComponentFactory(vueComponent, options);
    return typeof options === 'function' ? com : (options: any) => {
        var resultCom = ComponentFactory(vueComponent, options);
        return resultCom;
    };
}

function ComponentFactory(oldComponentFactory: any, options: any) {


    var com = oldComponentFactory(options);

    if (options && typeof options === 'function') {
        //componentPlugIns.setSource(args[0]);
        com.options.type = options;
    }

    return com;
}





export { Vue, Component, Watch, Prop, Controller }
