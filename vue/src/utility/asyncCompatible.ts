 
export function asyncCompatible() {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        let originFunc = descriptor.value;
        descriptor.value = async function (...param: any[]) {
            let paramLength = param.length;
            //debugger;
            let actParam = paramLength > 1 ? param.slice(0, paramLength) : param;
            let p: Function = paramLength > 0 ? param[paramLength - 1] : null;
            let returnObj = originFunc.call(this, ...actParam);
            let hasThen = true;
            try {
                hasThen = returnObj.then !== "undefined";
            } catch (error) {
                hasThen = false;
            }
            if (hasThen) {
                var result;
                try {
                    result = await returnObj;
                }
                finally {
                    p && p(result);
                }

                // returnObj.then((r: any) => {

                // }).catch((r: any) => {

                //     p && p();
                //     
                // });
            }
            else {
                p && p(returnObj);
            }

        }

    }
}