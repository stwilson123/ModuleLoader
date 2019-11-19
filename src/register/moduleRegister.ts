import { IDependencyRegister} from "../ioc/iocManager"
import { Container }  from "inversify";

class ModuleRegister implements IDependencyRegister
{
    public register(RegistrationContexts: import("../ioc/iocManager").RegistrationContext) {

        RegistrationContexts.iocManger.register((c:Container) => {
            debugger;

        });
    }
    
}

