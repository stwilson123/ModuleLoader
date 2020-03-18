//import 'es6-promise/auto'

// import all helpers
// const helpersContext = require.context('../helpers', true)
// helpersContext.keys().forEach(helpersContext)

// require all test files

const testsContext = require.context('./', true, /\.spec.ts$/)
testsContext.keys().forEach(testsContext)

