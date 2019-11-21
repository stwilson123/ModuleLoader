import { expect, assert } from 'chai'
import { describe } from "mocha";
import { BlocksModule, globalIocManager, IBootstrapper, Types, IBlocksShell } from "@/interface";
import { Bootstrapper } from "@/index";
import { CurrentModule as module1 } from "../testModel/bootstrapModel/module1/module1";
import { CurrentModule as module2 } from "../testModel/bootstrapModel/module2/module2";

describe("bootstraptest", () => {
    let tsContext = require.context("../testModel/bootstrapModel/", true, /ts$/);
    globalIocManager.register((c) => c.bind<IBootstrapper>(Types.IBootstrapper).toConstantValue(Bootstrapper));
    Bootstrapper.PlugInSources.push(tsContext);
    Bootstrapper.initialize();
    it("bootstrap auto inject modules", () => {
        let shell = globalIocManager.get<IBlocksShell>(Types.IBlocksShell);

        expect(shell.moduleMapTypes.size).to.equal(2);


        // for (const moduleObj of shell.moduleMapTypes.keys()) {
        //     expect(moduleObj).be
        // }

        // expect(shell.moduleMapTypes.get).be.instanceOf(module1);
        let moduleMapTypes = [...shell.moduleMapTypes.keys()]
   
        for (const registerModule of moduleMapTypes) {
            if (registerModule === module1) {
                debugger
                expect(registerModule).be.equal(module1);
                continue;
            }
            if (registerModule === module2) {
                expect(registerModule).be.equal(module2);
                continue;

            }
            expect(false, "Not found moduleType register.").equal(true);
        }


        let blocksModules = shell.BlocksModules;
        let module1Obj = blocksModules[0];
        let module2Obj = blocksModules[1];
        let moduleStartupObj = blocksModules[2];

        expect(module1Obj).to.not.null;
        expect(module1Obj).to.has.property("moduleName","module1")
       
        expect(module2Obj).to.not.null;
        expect(module2Obj).to.has.property("moduleName","module2")

        expect(moduleStartupObj).to.not.null;
        expect(moduleStartupObj).to.has.property("moduleName","RouteStartupModule")



    })



});