import { decorate, METADATA_KEY } from "inversify";
import * as metaReflectType    from "reflect-metadata";


let decorateIfNoExist = (decorator: (ClassDecorator | ParameterDecorator | MethodDecorator), target: any, parameterIndex?: number | string): void =>{
    
    if(Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES,target) )
        return;
    return decorate(decorator, target, parameterIndex);
};



export { decorateIfNoExist}