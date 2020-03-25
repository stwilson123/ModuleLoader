import { it, Func, Test } from "mocha";
import { isPromise } from "@/utility/helper";


let testItFun = function (pendingPromise: Promise<void>[], title: string, fn?: Func): Test {
    let PromiseArray = pendingPromise;
    let privateResolve: () => void;
    let privatePromise = new Promise<void>((r) => { privateResolve = r; });
    PromiseArray.push(privatePromise);
    return it(title, async function (...args) {
        debugger
        let fnResult = fn?.call(this, ...args)
        if (isPromise(fnResult))
            await fnResult;
        privateResolve();
    })
}

export { testItFun }