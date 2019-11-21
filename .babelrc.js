// const babelPresetFlowVue = {
//   plugins: [
//     require('@babel/plugin-proposal-class-properties'),
//     // require('@babel/plugin-syntax-flow'), // not needed, included in transform-flow-strip-types
//     require('@babel/plugin-transform-flow-strip-types')
//   ]
// }

module.exports = {
  presets: [
     
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
     "babel-plugin-transform-typescript-metadata"



  ]

}
