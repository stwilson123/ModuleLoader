import { expect } from 'chai'
import { describe } from "mocha";
import { /*globalIocManager,*/ IBootstrapper, Types, IBlocksShell, IocManager, BlocksModule } from "@/interface";
import {  BlocksBoostrapper } from "@/index";

import module2View2 from "../testModel/manifestModel/module2/src/view2";
import module1View2 from "../testModel/manifestModel/module1/src/view2";

import { IResourceManager } from '@/manifest/abstract';
import { resourceManager as defaultResourceManager } from "@/manifest/resourceManager";

describe("manifestModule test", async () => {
    // debugger
    let tsContext = require.context("../testModel/manifestModel/", true, /ts$/);
    let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = new IocManager());
   // globalIocManager.register((c) => c.bind<IBootstrapper>(Types.IBootstrapper).toConstantValue(Bootstrapper));
    Bootstrapper.PlugInSources.push(tsContext);
    Bootstrapper.initialize();
    let globalIocManager = Bootstrapper.iocManager;
    let shell = globalIocManager.get<IBlocksShell>(Types.IBlocksShell);



    it("resourceManager get ", async () => {
        let resourceManager = globalIocManager.get<IResourceManager>(Types.IResourceManager);
        let resources = resourceManager.getResources();
        expect(resources).lengthOf(1);

        let moduleResource = resources.get("module1");
        expect(moduleResource).not.undefined;
        if (moduleResource) {
            let resourceDef = moduleResource.get(defaultResourceManager.getResourceKey("component", "testResource"));
            expect(resourceDef).not.undefined;

            if (resourceDef) {
                let resourcePromise: Promise<any> = resourceDef.resource;
                let resource = await resourcePromise;
                expect(resource.default).equal(module2View2);

            }
        }


    });


    // it("vue Controller can get resouces. ", async () => {
    //     let viewComponent1 = new module1View2();

    //     let resourcePromise: Promise<any> = viewComponent1.getResources("module1", "component", "testResource")
    //     expect(resourcePromise).not.undefined;

    //     if (resourcePromise) {
    //         let resource = await resourcePromise;
    //         expect(resource.default).equal(module2View2);

    //     }

    // });




});