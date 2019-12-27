// const babelPresetFlowVue = {
//   plugins: [
//     require('@babel/plugin-proposal-class-properties'),
//     // require('@babel/plugin-syntax-flow'), // not needed, included in transform-flow-strip-types
//     require('@babel/plugin-transform-flow-strip-types')
//   ]
// }

module.exports = {
  presets: [

    
    [
      "@babel/preset-env",
      {
        "modules": false,
        "useBuiltIns": "entry",
        "corejs": 3.1,
        "targets": {
           "ie":"10"
        }
      }
    ],
    "@babel/preset-typescript"
    // require('babel-preset-flow-vue')
    // babelPresetFlowVue
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", {
      "legacy": true
    }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/proposal-object-rest-spread",
    "babel-plugin-transform-typescript-metadata",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3,
        "helpers": false,
        "regenerator": true,
        "useESModules": false
      }
    ],
     
  ]

}
