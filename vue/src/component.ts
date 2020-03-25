// import { Component as vueComponent, Watch, Prop } from 'vue-property-decorator';

// let Component = (options: any) => {
//     return ComponentFactory(vueComponent, options);
// }

// function ComponentFactory(oldComponentFactory: any, options: any) {
//     let com = oldComponentFactory(options);
//     if (typeof options === 'function') {
//         com.options.type = options;
//         return com;
//     }
//     return function (Component: any) {
//         let comObj = com(Component);
//         if (typeof Component === 'function')
//             comObj.options.type = options;
//         return comObj;
//     };
// }


// export { Component }
import { Component  , Watch, Prop } from 'vue-property-decorator';

export { Component }