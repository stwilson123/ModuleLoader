const base = require('./karma.base.config.js')

module.exports = function (config) {
  config.set(Object.assign(base, {
   browsers: ['Chrome', 'Firefox', 'Safari','chromeDebug'],
   // browsers: ['chromeDebug'],
    
    reporters: ['progress'],
    singleRun: false,
    plugins: base.plugins.concat([
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher'
    ]),
    customLaunchers: {
      chromeDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333'],
        debug: true
      }
    }
  }))
}
