//import { Bootstrapper } from "@blocks-framework/core";
import getDecorators from "./index";
import { Container } from 'inversify';
 

class InjectModel
{
    public Conainter:Container|undefined = undefined;
}
let InjectCore = new InjectModel();
let SpecialInject = getDecorators(() => {
    if(InjectCore.Conainter === undefined)
        throw new Error("InjectCore.Conainter is undefined.")
    return InjectCore.Conainter;
});

 
 

export { SpecialInject,InjectCore }