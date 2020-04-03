import { expect } from 'chai'
import { describe} from "mocha";
import { BlocksBoostrapper ,IBootstrapper, Types, IBlocksShell, IocManager, BlocksModule,IResourceManager,getResourceKey} from "@/index";
// import module2View2 from "../testModel/manifestModel/module2/src/view2.bl";
// import module1View2 from "../testModel/manifestModel/module1/src/view2.bl";
import { SpecialInject,InjectCore } from "@/index";

describe("manifestModule test",  () => {  
    let module2View2Promise = import("../testModel/manifestModel/module2/src/view2.bl");
    let module1View2Promise = import("../testModel/manifestModel/module1/src/view2.bl");
     
    let tsContext = require.context("../testModel/manifestModel/", true, /(((?<!bl)\.ts)|\.bl)$/);
    let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = new IocManager());
    Bootstrapper.PlugInSources.push(tsContext);
    let BootstrapperInitStats = Bootstrapper.initialize();
    let globalIocManager = Bootstrapper.iocManager;
    InjectCore.Conainter = globalIocManager.getContainer();

    it("resourceManager get ", async () => {
       
        let module2View2 = await module2View2Promise;
        
        let resourceManager = globalIocManager.get<IResourceManager>(Types.IResourceManager);
        let resources = resourceManager.getResources();
        expect(resources).lengthOf(1);

        let moduleResource = resources.get("module1");
        expect(moduleResource).not.undefined;
        
        if (moduleResource) {
            let resourceDef = moduleResource.get(getResourceKey("component", "testResource"));
            expect(resourceDef).not.undefined;
            expect(resourceDef).not.null;
            if (resourceDef) {
                let resourcePromise: Promise<any> = resourceDef.resource;
                let resource = await resourcePromise;
                
                expect(resource).equal(module2View2);

            }
        }


    });


    it("vue Controller can get resouces. ", async () => {
        //await BootstrapperInitStats;
        
        let module1View2 = await module1View2Promise;
        let module2View2 = await module2View2Promise;
        
        let viewComponent1 = new module1View2.default();
       
        let resourcePromise: Promise<any> = viewComponent1.getResources("module1", "component", "testResource")
        expect(resourcePromise).not.undefined;

        if (resourcePromise) {
            let resource = await resourcePromise;
            expect(resource).equal(module2View2);

        }

    });
 
});

