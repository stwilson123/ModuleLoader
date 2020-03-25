import { decorate } from "inversify";
import { BlocksBoostrapper } from './core/bootstrapper';
import { BlocksModule,injectable,IocManager } from "./interface"
export * from "./interface";

// const TYPES = {
//     BlocksModule: Symbol.for("BlocksModule"),

// };
decorate(injectable(), BlocksModule);

let Bootstrapper = BlocksBoostrapper.create(undefined, (o) => o.iocManager = new IocManager());



export {
    Bootstrapper,BlocksBoostrapper
}
