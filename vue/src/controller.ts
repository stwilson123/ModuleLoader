import { Component as vueComponent, Watch, Prop, Vue } from 'vue-property-decorator';
import { isPromise } from "./utility/helper";
declare module 'vue/types/options' {

    interface ComponentOptions<V extends Vue> {
        type?: Object
    }

}

declare module 'vue/types/Vue' {

    interface Vue {
        $dialog?: any,
        $router?: any,
        $route?: any
    }

}
@vueComponent({})
class Controller extends Vue {
    constructor() {
        super()
    }
    @Prop({ type: String })
    UniqueKey: string ="";
    viewWillEnterResult: any;
    viewDidEnterResult: any;
    viewAnimationEndTime: any;
    created() {
        this.$emit("beforeViewWillEnter", this);
        this.viewWillEnterResult = this.viewWillEnter();
        console.log("assign viewWillEnterResult")
        if((typeof this.UniqueKey === "undefined" || this.UniqueKey === "")&& this.$route && this.$route.meta && this.$route.meta.uniqueKey)
        {
            this.UniqueKey = this.$route.meta.uniqueKey;
        }
    }
    async mounted() {
        this.$emit("ViewDidEnterStart", this);

        if (isPromise(this.viewDidEnter)) {
            this.viewDidEnterResult = this.viewDidEnter();
            await this.viewDidEnterResult;
        }
        else
            this.viewDidEnter();
        this.viewAnimationEndTime = setTimeout(() => {
            this.viewAnimationEnd();
        }, 800);
    }

    beforeMount() {
        this.$emit("beforeViewDidEnter", this);

        this.beforeViewDidEnter();
    }

    beforeViewDidEnter() {

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

        if (isPromise(this.viewDidEnterResult)) {
            await this.viewDidEnterResult;
            console.debug("await  viewDidEnterResult")
        }
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

            _this.$emit("viewReaderFinish", _this);
        })
    }
    viewWillEnter() {

    }
    viewDidEnter() {

    }
    switchMode = 0;
    switchResolve: any;
    async switch(switchUniqueKey: any, switchParams: any) {
        if (typeof switchParams === undefined || switchParams === null || typeof switchUniqueKey === undefined || switchUniqueKey.uniqueKey === null)
            throw new Error("switchParams must contains uniqueKey.")
        let routeManager = globalIocManager.get<IRouteManager>(Types.IRouteManager);
        let uniqueKey = switchUniqueKey.moduleName ? RouteManager.getUniqueKey(switchUniqueKey.moduleName, switchUniqueKey.uniqueKey) :
            RouteManager.getUniqueKey(this.getModuleName(), switchUniqueKey.uniqueKey)
        let route: any;
        for (let layoutRoutes of routeManager.getRoute()) {
            route = layoutRoutes.children.find((r: any) => r.uniqueKey === uniqueKey);
            if (route)
                break;
        }

        if (this.switchMode === 0) {
            let dialogParams = Object.assign(true, {
                component: route.component,
            }, switchParams)
            dialogParams.componentProps = Object.assign({ UniqueKey: uniqueKey }, dialogParams.componentProps);
            let dialog = await this.$dialog.create(dialogParams)
            return await dialog.present();
        }
        else {
            let routeReslove: any, routeReject: any;
            let routePushPromise = new Promise((resolve, reject) => {
                routeReslove = resolve;
                routeReject = reject;
            })
            this.$router.push({ name: route.name }, () => {
                routeReslove({
                    onDidDismiss: new Promise((resolve, reject) => {
                        this.switchResolve = resolve
                    })
                });

            }, () => {
                routeReject()
            });
            return await routePushPromise;

        }
    }
    exit(...args: any[]) {
        if (this.switchMode === 0) {
            this.$emit("exit", ...args)
        }
        else {
            if (this.switchResolve) {
                this.switchResolve();
            }
        }
    }
    getModuleName() {
        let shell = globalIocManager.get<IBlocksShell>(Types.IBlocksShell);
        let moduleName = shell.typeMapModuleName.get(this.$options.type);
        if (moduleName === undefined)
            throw new Error(this + " not belong to framework.")
        return moduleName;
    }

    getResources(moduleName: string, resourceType: string, resourceName: string) {
        let resourceManager = globalIocManager.get<IResourceManager>(Types.IResourceManager);
        let resourceDef = resourceManager.getResource(moduleName, resourceType, resourceName);
        if (resourceDef === undefined)
            throw new Error(`Can not found resourceType:${resourceType}, resourceName:${resourceName} in resources.`)
        return resourceDef.resource;
    }



}

export { Controller }