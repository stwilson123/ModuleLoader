import { Component as vueComponent, Watch, Prop, } from 'vue-property-decorator';

//same to vue-class-component
export const $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured', // 2.5
    'serverPrefetch' // 2.6
]


let Component = (options: any) => {
    return ComponentFactory(vueComponent, options);
}

function ComponentFactory(oldComponentFactory: any, options: any) {
    if (typeof options === 'function') {
        handleExtendController(options, options);
        let com = oldComponentFactory(options);
        // com.options.type = options;
        return com;
    }
    return function (Component: any) {
        handleExtendController(Component, options);
        let com = oldComponentFactory(options);
        let comObj = com(Component);
        if (typeof Component === 'function')
            //   comObj.options.type = options;
            return comObj;
    };
}

function handleExtendController(oldComponentFactory: any, options: any) {
    let baseController = oldComponentFactory.prototype.__proto__;
    Object.getOwnPropertyNames(baseController).forEach((key: any) => {

        if ($internalHooks.indexOf(key) > -1) {
            options[key] = baseController[key];
            return;
        }
    });
}


export { Component }
// import { Component } from 'vue-property-decorator';

// export { Component }