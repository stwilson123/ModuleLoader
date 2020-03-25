import { interfaces } from "inversify";

import {
    makePropertyInjectDecorator,
    makePropertyMultiInjectDecorator,
    makePropertyInjectTaggedDecorator,
    makePropertyInjectNamedDecorator
} from "./decorators";


function getDecorators(containerFunc:() => interfaces.Container, doCache = true) {
    let lazyInject = makePropertyInjectDecorator(containerFunc, doCache);
    let lazyInjectNamed = makePropertyInjectNamedDecorator(containerFunc, doCache);
    let lazyInjectTagged = makePropertyInjectTaggedDecorator(containerFunc, doCache);
    let lazyMultiInject = makePropertyMultiInjectDecorator(containerFunc, doCache);

    return {
       lazyInject ,
       lazyInjectNamed,
       lazyInjectTagged,
       lazyMultiInject
    };

}

export default getDecorators;