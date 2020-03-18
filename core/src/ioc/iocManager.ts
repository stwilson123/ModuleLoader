
import { Container,inject,injectable, multiInject } from "inversify";
import "reflect-metadata";
class IocManager
{

    private denpendcyRegisters:IDependencyRegister[];
    private diConainter:Container;
    constructor()
    {
        this.denpendcyRegisters = [];
        this.diConainter = new Container();
    }
    public addDenpendcyRegistrar(registrar:IDependencyRegister )
    {
        this.denpendcyRegisters.push(registrar);
    }

    public registerModuleByConvention(moduleContexts:any)
    {
        let registerCTX = new RegistrationContext(moduleContexts,this);
        for (let register of this.denpendcyRegisters) {
            register.register(registerCTX);
        }
    }

    public register(ContainerDelegate:(c:Container) => void)
    {
        if(ContainerDelegate !== undefined)
            ContainerDelegate(this.diConainter);
    }


    public get<T>(serviceIdentifier: ServiceIdentifier<T>): T
    {
        return this.diConainter.get(serviceIdentifier);
    }

    public getAll<T>(serviceIdentifier: ServiceIdentifier<T>): T[]
    {
        return this.diConainter.getAll(serviceIdentifier);
    }

    public isRegistered<T>(serviceIdentifier: ServiceIdentifier<T>)
    {
        return this.diConainter.isBound(serviceIdentifier);
    }

    public unbindAll()
    {
        this.diConainter.unbindAll();
    }

}
type ServiceIdentifier<T> = (string | symbol | Newable<T> | Abstract<T> );


interface IDependencyRegister
{
     register(RegistrationContexts:RegistrationContext):void;
}
interface Newable<T> {
    new (...args: any[]): T;
}
interface Abstract<T> {
    prototype: T;
}
class RegistrationContext
{
    public moduleContexts:any;

    public iocManger:IocManager;
    constructor(moduleContexts:any, iocManager:IocManager)
    {
        this.iocManger = iocManager;
        this.moduleContexts = moduleContexts;
    }
}

export { IocManager, IDependencyRegister, RegistrationContext, inject, injectable, multiInject}