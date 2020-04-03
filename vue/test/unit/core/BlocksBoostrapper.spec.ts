import { expect } from 'chai'
import { describe, it } from "mocha";
import { BlocksBoostrapper, Bootstrapper, IBootstrapper, Types, IBlocksShell, IocManager, BlocksModule } from "@/index";
import { CurrentModule as module1 } from "../testModel/bootstrapModel/module1/module1";
import { CurrentModule as module2 } from "../testModel/bootstrapModel/module2/module2";
import { vieRegister1 } from "../testModel/bootstrapModel/module1/viewRegister1";
import { vieRegister2 } from "../testModel/bootstrapModel/module2/viewRegister2";
import view1 from "../testModel/bootstrapModel/module1/src/view1";

import view2 from "../testModel/bootstrapModel/module2/src/view2";

import { module1RouteProvider as routeProvider1 } from "../testModel/bootstrapModel/module1/module1RouteProvider";
import { module2RouteProvider as routeProvider2 } from "../testModel/bootstrapModel/module2/module2RouteProvider";
import { SpecialInject, InjectCore } from "@/index";
import { testItFun } from "../../it";

describe("bootstraptest", () => {
    let tsContext = require.context("../testModel/bootstrapModel/", true, /(((?<!bl)\.ts)|\.bl)$/);
    //globalIocManager.register((c) => c.bind<IBootstrapper>(Types.IBootstrapper).toConstantValue(Bootstrapper));
    // let Bootstrapper = BlocksBoostrapper. create(undefined, (o) => o.iocManager = new IocManager());
    Bootstrapper.PlugInSources.push(tsContext);
    Bootstrapper.initialize();
    let globalIocManager = Bootstrapper.iocManager;
    let shell = globalIocManager.get<IBlocksShell>(Types.IBlocksShell);
    InjectCore.Conainter = globalIocManager.getContainer();
    let module2view1Promise = import("../testModel/bootstrapModel/module2/src/view1.bl");


    let testInjectModules = async (shell: IBlocksShell) => {
        let blocksModules = shell.BlocksModules;
        let module1Obj = blocksModules[0];
        let module2Obj = blocksModules[1];
        let moduleStartupObj = blocksModules[2];
        let module2view1 = await module2view1Promise;

        expect(module1Obj).to.not.null;
        expect(module1Obj).to.has.property("moduleName", "module1")

        expect(module2Obj).to.not.null;
        expect(module2Obj).to.has.property("moduleName", "module2")

        expect(moduleStartupObj).to.not.null;
        expect(moduleStartupObj).to.has.property("moduleName", "RouteStartupModule")


        expect(shell.moduleMapTypes.size).to.equal(2);

        let moduleMapTypes = [...shell.moduleMapTypes.keys()]
        for (const registerModule of moduleMapTypes) {
            if (registerModule === module1) {
                expect(registerModule).be.equal(module1);
                expect(shell.moduleMapTypes.get(registerModule)).to.be.all.members([module1, view1, vieRegister1, routeProvider1]);
                continue;
            }
            if (registerModule === module2) {
                expect(registerModule).be.equal(module2);
                expect(shell.moduleMapTypes.get(registerModule)).to.be.all.members([module2, module2view1, view2, vieRegister2, routeProvider2]);
                continue;

            }
            expect(false, "Not found moduleType register.").equal(true);
        }
    }

    let testGetRoute = (bootstrapper: BlocksBoostrapper<BlocksModule>) => {
        let routes = bootstrapper.RouteHelper.getRoute();
        expect(routes).lengthOf(2);
    }

    let testGetModuleName = async () => {
        let module2view1 = await module2view1Promise;

        let view2Obj = new module2view1.default();
        let moduleName = view2Obj.getModuleName();

        expect(moduleName).equal("module2");
    }

    it("bootstrap auto inject modules", () => {
        testInjectModules(shell);
    });



    it("RouteHelper can get routes", () => {
        testGetRoute(Bootstrapper);
    });

    it("vue Controller can getModuleName", () => {

        testGetModuleName();
    });



    it("bootstrap can reinitialize", async () => {
        let iocManager = new IocManager();
        let bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = iocManager);
        let tsContext = require.context("../testModel/bootstrapModel/", true, /(((?<!bl)\.ts)|\.bl)$/);
        iocManager.register((c) => c.bind<IBootstrapper>(Types.IBootstrapper).toConstantValue(bootstrapper));
        bootstrapper.PlugInSources.push(tsContext);
        await bootstrapper.initialize();

        bootstrapper.dispose();
        await bootstrapper.initialize();
        let shell = iocManager.get<IBlocksShell>(Types.IBlocksShell);
        testInjectModules(shell);
        testGetRoute(bootstrapper);


    });
});
