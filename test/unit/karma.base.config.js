const alias = require('../../scripts/alias')
//const featureFlags = require('../../scripts/feature-flags')
const webpack = require('webpack')

const webpackConfig = {
  mode: 'development',
  resolve: {
      alias: alias,
      extensions: ['.ts', '.tsx', '.js','.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __WEEX__: false,
      'process.env': {
        TRANSITION_DURATION: process.env.CI ? 100 : 50,
        TRANSITION_BUFFER: 10,
        //...featureFlags
      }
    })
  ],
  devtool: '#inline-source-map',
  node: {
    fs: 'empty',
  },

}

// shared config for all unit tests
module.exports = {
  frameworks: ['mocha'],
  files: [
    './index.ts'
  ],
  preprocessors: {
    './index.ts': ['webpack', 'sourcemap']
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  },
  plugins: [
    'karma-mocha',
    'karma-chai',
    'karma-mocha-reporter',
    'karma-sourcemap-loader',
    'karma-webpack',
  ]
}
