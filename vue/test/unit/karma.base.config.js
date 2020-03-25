const alias = require("../../scripts/alias");
const path = require('path');
//const featureFlags = require('../../scripts/feature-flags')
const webpack = require("webpack");
const VueBuilder = require('vue-builder-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
const webpackConfig = {
  mode: "development",
  resolve: {
    alias: alias,
    extensions: [".ts", ".tsx", ".js", ".json", ".bl",".html"]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: "babel-loader"
        // exclude: /node_modules/,
      },
      {
        test: /\.(vue|bl)$/,
        loader: "vue-loader"
        // options: {
        //     loaders: {
        //         'scss': 'vue-style-loader!css-loader?!postcss-loader!sass-loader',
        //     }
        // }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __WEEX__: false,
      "process.env": {
        TRANSITION_DURATION: process.env.CI ? 100 : 50,
        TRANSITION_BUFFER: 10
        //...featureFlags
      }
    }),
    new VueBuilder({
      path: resolve('testModel/'),
      fileExtensions: "bl",
      allScoped: true,
      filePathTestRegex: /[*].*\.(js|ts|css|sass|scss|html|htm|bl)$/
  }),
  ],
  devtool: "source-map",
  node: {
    fs: "empty"
  }
};

// shared config for all unit tests
module.exports = {
  frameworks: ["mocha"],
  // files: [
  //   './index.ts'
  // ],
  files: [
    {
      pattern: "./core/*.spec.ts",
      watched: true,
      included: true,
      served: true,
      nocache: false
    }
  ],
   preprocessors: {
    "./core/*.spec.ts": ["webpack", "sourcemap"]
  },
  // preprocessors: {
  //   "./index.ts": ["webpack", "sourcemap"]
  // },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  },
  plugins: [
    "karma-mocha",
    "karma-chai",
    "karma-mocha-reporter",
    "karma-sourcemap-loader",
    "karma-webpack"
  ]
};
