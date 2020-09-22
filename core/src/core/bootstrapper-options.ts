
import { IocManager } from "./../ioc/iocManager";

export class BootstrapperOptions
{
    public iocManager:IocManager;
    
    
    constructor()
    {
        this.iocManager =  new IocManager();
    }

}