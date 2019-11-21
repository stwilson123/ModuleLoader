
import { IocManager } from "./interface";

export class BootstrapperOptions
{
    public iocManager:IocManager;
    
    
    constructor()
    {
        this.iocManager =  new IocManager();
    }

}