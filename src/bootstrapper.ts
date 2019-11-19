import { BootstrapperOptions } from './bootstrapper-options'
import { Container, injectable, decorate, inject } from "inversify";
import { IocManager,BlocksModule, Types, IDependency, IBootstrapper,IBlocksShell   } from './interface';
import { BlocksShell } from "./shell"
class BlocksBoostrapper<T extends BlocksModule> extends IBootstrapper
{
    //temp 
    public iocManager: IocManager;
    private startModule?: T;
    private plugInSources: any[];
    get PlugInSources() {
        return this.plugInSources;
    }
    private constructor(startModule?: T, optionsFunc?: (opt: BootstrapperOptions) => void) {
        super();
        let bootstarpperOptions = new BootstrapperOptions();
        if (optionsFunc !== undefined) {
            optionsFunc(bootstarpperOptions);
        }

        this.iocManager = bootstarpperOptions.iocManager;
        this.startModule = startModule;
        this.plugInSources = [];

    }


    public static create<T extends BlocksModule>(startModule?: T, optionsFunc?: (opt: BootstrapperOptions) => void): BlocksBoostrapper<T> {
        return new BlocksBoostrapper(startModule, optionsFunc);
    }

    public initialize() {
        //Logger
        this.registerShell()

        let shell = this.iocManager.get<IBlocksShell>(Types.IBlocksShell);
        shell.pluginSource = this.plugInSources;
        shell.initialize();
    }


    private registerShell() {
        this.iocManager.register((c: Container) => {
            c.bind(IocManager).toConstantValue(this.iocManager);
            c.bind<IBlocksShell>(Types.IBlocksShell).to(BlocksShell).inSingletonScope();
            //c.bind<BlocksShell>(Types.IBlocksShell).to(BlocksShell).inSingletonScope();

            decorate(injectable(), IocManager);
            decorate(injectable(), BlocksShell);
        });

    }
}



export { BlocksBoostrapper }