import { expect } from 'chai'
import { describe} from "mocha";
import { BlocksBoostrapper ,IBootstrapper, Types, IBlocksShell, IocManager, BlocksModule,IResourceManager,getResourceKey} from "@/index";
// import module2View2 from "../testModel/manifestModel/module2/src/view2.bl";
// import module1View2 from "../testModel/manifestModel/module1/src/view2.bl";
import { SpecialInject,InjectCore } from "@/index";
import vue  from "vue"

describe("manifestModule test",  () => {  
    let module1View1Promise = import("../testModel/lifetimeModel/module1/src/view1.bl");
    let module1View2Promise = import("../testModel/lifetimeModel/module1/src/view2.bl");
     
    let tsContext = require.context("../testModel/manifestModel/", true, /(((?<!bl)\.ts)|\.bl)$/);
    let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = new IocManager());
    Bootstrapper.PlugInSources.push(tsContext);
    let BootstrapperInitStats = Bootstrapper.initialize();
    let globalIocManager = Bootstrapper.iocManager;
    InjectCore.Conainter = globalIocManager.getContainer();
    it("vue Controller can get injectModule in property. ", async () => {
        //await BootstrapperInitStats;
        
        let module1View1 = await module1View1Promise;
         
        let viewComponent1 = new module1View1.default({el:"id"});
      
        expect(viewComponent1.testProperty ? true : false).be.true;

    });



    it("vue Controller inoke viewDidEnter when mounted", async () => {
        //await BootstrapperInitStats;
        
        let View1 = await module1View1Promise;

        let viewComponent1 = new View1.default();
        debugger
        viewComponent1.$mount();
        expect(viewComponent1.lifetime === 2 ).be.true;

        let View2 = await module1View2Promise;

        let viewComponent2 = new View2.default();
        viewComponent2.$mount();
        expect(viewComponent2.lifetime ===2 ).be.true;
      

    });

});

