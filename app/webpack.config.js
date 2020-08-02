/* eslint-disable */
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Path to output directory relative to project root
const OUTPUT_DIR = 'dropshop/static/dist/'

// Path to output directory relative to project root
const ENTRY_DIR_PATH = 'assets/entries'

// The development server to use when in development/debug/hot-reload mode, for use
// with webpack-dev-server
const DEVELOPMENT_SERVER = 'http://localhost:3000'
const DJANGO_SERVER = 'http://localhost:8000'
const isProduction = process.env.NODE_ENV === 'production'

const getProjectAbsolutePath = (p) => path.join(path.resolve(__dirname), p)

function buildEntries(isDevServer) {
    const entryDirPath = getProjectAbsolutePath(`./${ENTRY_DIR_PATH}`)
    const entry = {}

    fs.readdirSync(entryDirPath)
        .filter(file => !fs.statSync(path.join(entryDirPath, file)).isDirectory() && file.endsWith('.js'))
        .forEach(file => {
            const name = path.parse(file).name
            entry[name] = ['@babel/polyfill', `${entryDirPath}/${file}`]

            if (isDevServer) {
                entry[name].unshift(
                    `webpack-dev-server/client?${DEVELOPMENT_SERVER}`,
                    'webpack/hot/only-dev-server',
                )
            }
        })
    return entry
}

function buildWebpackConfig() {
    const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'))
    const environment = {
        isDevServer,
    }

    const entry = buildEntries(isDevServer)
    const output = {
        path: getProjectAbsolutePath('./' + OUTPUT_DIR),
        filename: '[name].[hash].js',
    }

    const plugins = [
        new webpack.DefinePlugin({
            'process.env': environment,
        }),
        new BundleTracker({ path: __dirname, filename: './webpack-stats.json' }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
    ]

    if (isProduction) {
        plugins.push(new webpack.SourceMapDevToolPlugin({
            // asset matching
            filename: '[file].map',
            exclude: [/vendor\.(.*)\.js/, /node_modules/],

            // quality/performance
            module: true,
            columns: false,
        }))
    }

    const sassPlugins = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: !isProduction,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                options: {},
                plugins: [
                    require('autoprefixer')(),
                    require('cssnano')(),
                ],
                sourceMap: !isProduction,
            },
        },
        {
            loader: 'resolve-url-loader',
            options: {
                sourceMap: !isProduction,
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: !isProduction,
            },
        },
    ]

    const rules = [
        {
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*)?$/i,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        name: 'fonts/[name].[ext]',
                    },
                },
            ],
        },
        {
            test: /\.xml$/,
            exclude: [/node_modules/],
            use: 'raw-loader',
        },
        {
            test: /\.(png|jpe?g|gif|bmp|webp)$/,
            exclude: [/node_modules/],
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[ext]',
                    },
                },
            ],
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDevServer,
                    },
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: !isProduction,
                    },
                },
            ],
        },
        {
            test: /\.scss$/,
            exclude: [/importable\//],
            use: [
                'style-loader',
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDevServer,
                    },
                },
                ...sassPlugins,
            ],
        },
        {
            test: /importable\/.+\.scss$/,
            use: [
                'style-loader',
                ...sassPlugins,
            ],
        },
    ]

    const babelLoader = {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            presets: [
                [
                    '@babel/env',
                    {
                        modules: false,
                        debug: !isProduction,
                        useBuiltIns: 'usage',
                    },
                ],
                '@babel/react',
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                ['@babel/plugin-proposal-class-properties', { 'loose': false }],
                '@babel/plugin-proposal-json-strings',
                'wildcard',
            ],
        },
    }

    const alias = {}
    let devServer
    if (isProduction) {
        environment.NODE_ENV = JSON.stringify('production')
        babelLoader.options.plugins.push('@babel/plugin-transform-runtime')
        babelLoader.options.plugins.push('@babel/plugin-transform-react-constant-elements')
    } else {
        plugins.push(
            new webpack.NamedModulesPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: true,
            }),
        )

        if (isDevServer) {
            // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
            output.publicPath = `${DEVELOPMENT_SERVER}/${OUTPUT_DIR}`
            plugins.push(new webpack.HotModuleReplacementPlugin())

            babelLoader.options.plugins.push('react-hot-loader/babel')

            devServer = {
                hot: true,
                overlay: true,
                headers: {
                    'Access-Control-Allow-Origin': `${DJANGO_SERVER}, ${DEVELOPMENT_SERVER}`,
                },
            }

            alias['react-dom'] = '@hot-loader/react-dom'
        }
    }

    rules.push({
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
            babelLoader,
        ],
    })

    return {
        mode: !isProduction ? 'development' : 'production',
        cache: true,
        entry,
        plugins,
        optimization: {
            minimize: isProduction,
        },
        devtool: false,
        module: {
            rules,
        },
        output,
        resolve: {
            modules: [
                'node_modules',
            ],
            alias,
        },
        devServer,
    }
}

module.exports = buildWebpackConfig()
