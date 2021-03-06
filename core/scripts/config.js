const path = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
const replace = require('rollup-plugin-replace')
const flow = require('rollup-plugin-flow-no-whitespace')
const version = process.env.VERSION || require('../package.json').version
const typescript = require('rollup-plugin-typescript2')
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
console.log(typescript)
const resolve = p => {
    return path.resolve(__dirname, '../', p)
}

const banner =
    '/*!\n' +
    ` * module-loader.js v${version}\n` +
    ` * (c) 2014-${new Date().getFullYear()} stwilson\n` +
    ' * Released under the MIT License.\n' +
    ' */'


const builds = {

    // Runtime only ES modules build (for bundlers)
    'web-full-esm-browser': {
        entry: resolve('src/index.ts'),
        dest: resolve('dist/blocks-module-loader.esm.browser.js'),
        env: 'development',
        format: 'esm',
        banner,

    },
    // Runtime+compiler ES modules build (for direct import in browser)
    'web-full-esm-browser-prod': {
        entry: resolve('src/index.ts'),
        dest: resolve('dist/blocks-module-loader.esm.browser.min.js'),
        format: 'esm',
        transpile: false,
        env: 'production',
        //external:['inversify','reflect-metadata'],
        //alias: { he: './entity-decoder' },
        banner
    },

    // Runtime+compiler development build (Browser)
    'web-full-dev': {
        entry: resolve('src/index.ts'),
        dest: resolve('dist/blocks-module-loader.js'),
        plugins: [babel({
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.ts',
                '.tsx'
            ],
            runtimeHelpers: true

        }), nodeResolve(), commonjs()],
        format: 'umd',
        env: 'development',
        alias: { he: './entity-decoder' },
        banner
    },
    // Runtime+compiler production build  (Browser)
    'web-full-prod': {
        entry: resolve('src/index.ts'),
        dest: resolve('dist/blocks-module-loader.min.js'),
        plugins: [babel({
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.ts',
                '.tsx'
            ],
            runtimeHelpers: true

        }), nodeResolve(), commonjs()],
        //external:['vue','vue-property-decorator'],
        format: 'umd',
        env: 'production',
        alias: { he: './entity-decoder' },
        banner
    },
}

function genConfig(name) {
    const opts = builds[name]
    const config = {
        input: opts.entry,
        external: opts.external,
        plugins: [
            flow(),
            typescript({
                useTsconfigDeclarationDir: true,
                // tsconfigDefaults: { compilerOptions: { declaration: true } },
                tsconfig: resolve("tsconfig.json"),
            }),

            //   alias(Object.assign({}, aliases, opts.alias))
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName || 'interface' || 'BlocksModule',
            sourcemap: true
        },
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg)
            }
        }
    }

    // built-in vars
    const vars = {
        // __WEEX__: !!opts.weex,
        // __WEEX_VERSION__: weexVersion,
        __VERSION__: version
    }
    // feature flags
    // Object.keys(featureFlags).forEach(key => {
    //     vars[`process.env.${key}`] = featureFlags[key]
    // })
    // build-specific env
    if (opts.env) {
        vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
    }
    config.plugins.push(replace(vars))

    if (opts.transpile !== false) {
        // config.plugins.push(buble(
        //   //  { "transforms": { forOf: false, asyncAwait: false } }
        // ))

        config.plugins.push(babel({ runtimeHelpers: true }))


    }

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name
    })

    return config
}
 
if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET)
} else {
    exports.getBuild = genConfig
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}