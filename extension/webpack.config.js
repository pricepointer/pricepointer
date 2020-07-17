/* eslint-disable */
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin')
const pkg = require('../package.json')
const ExtensionReloader  = require('webpack-extension-reloader');
const baseManifest = require('./src/baseManifest.js')

// Path to output directory relative to project root
const OUTPUT_DIR = '_dist/'
const ENTRY_DIR_PATH = 'src/entries'

// The development server to use when in development/debug/hot-reload mode, for use
// with webpack-dev-server
const DEVELOPMENT_SERVER = 'http://localhost:3000'
const isProduction = process.env.NODE_ENV === 'production'

const getProjectAbsolutePath = (p) => path.join(path.resolve(__dirname), p)

function buildEntries(isDevServer) {
    const entryDirPath = getProjectAbsolutePath(`./${ENTRY_DIR_PATH}`)
    const entry = {}
    const plugins = []
    fs.readdirSync(path.resolve(entryDirPath))
        .filter(file => !fs.statSync(path.join(entryDirPath, file))
            .isDirectory() && file.endsWith('.js'))
        .forEach(file => {
            const name = path.parse(file).name
            entry[name] = ['@babel/polyfill', `${entryDirPath}/${file}`]

            const templatePath = path.resolve(`${entryDirPath}/../templates/${name}.html`)
            if (fs.existsSync(templatePath)) {
                plugins.push(
                    new HtmlWebpackPlugin({
                        template: templatePath,
                        chunks: [name],
                    }),
                )
            }

            if (!isProduction && isDevServer) {
                entry[name].unshift(
                    `webpack-dev-server/client?${DEVELOPMENT_SERVER}`,
                    'webpack/hot/only-dev-server',
                    // 'react-hot-loader/patch',
                )
            }
        })

    return {
        entry,
        plugins,
    }
}

function buildWebpackConfig() {
    const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'))
    const environment = {
        isDevServer,
    }

    const { entry, plugins: entryPlugins } = buildEntries(isDevServer)
    const output = {
        path: getProjectAbsolutePath('./' + OUTPUT_DIR),
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[id].[contenthash].js',
    }

    const plugins = [
        new CleanWebpackPlugin(),
        ...entryPlugins,
        new webpack.DefinePlugin({
            'process.env': environment,
        }),
        new BundleTracker({ filename: './webpack-stats.json' }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest,
                extend: { version: pkg.version },
            },
        }),
        new WriteFilePlugin(),
        new ExtensionReloader({
            port: 9090, // Which port use to create the server
            reloadPage: true, // Force the reload of the page also
            entries: { // The entries used for the content/background scripts or extension pages
                contentScript: 'content-script',
                background: 'background',
                extensionPage: 'popup',
            }),
    ]

    if (!isProduction) {
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
                        corejs: '3',
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

    let alias
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
            plugins.push(new webpack.HotModuleReplacementPlugin())

            babelLoader.options.plugins.push('react-hot-loader/babel')

            devServer = {
                hot: true,
                overlay: true,
            }

            alias = {
                'react-dom': '@hot-loader/react-dom',
            }
        }
    }

    rules.push({
        test: /\.worker\.js$/,
        exclude: [/node_modules/],
        use: [
            babelLoader,
            'worker-loader',
        ],
    })

    rules.push({
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
            babelLoader,
        ],
    })

    return {
        mode: isProduction ? 'production' : 'development',
        cache: true,
        entry,
        plugins,
        optimization: {
            minimize: isProduction,
            removeAvailableModules: false,
            removeEmptyChunks: false,
            runtimeChunk: { name: 'manifest' },
            splitChunks: {
                cacheGroups: {
                    ink: {
                        test(module) {
                            if (module && module.context) {
                                return (
                                    module.context.includes('node_modules') &&
                                    module.context.includes('ink')
                                )
                            }
                            return false
                        },
                        name: 'ink',
                        enforce: true,
                        chunks: 'all',
                    },
                    vendor: {
                        test(module) {
                            if (module && module.context) {
                                return (
                                    module.context.includes('node_modules') &&
                                    !module.context.includes('ink')
                                )
                            }
                            return false
                        },
                        name: 'vendor',
                        enforce: true,
                        chunks: 'all',
                    },
                },
            },
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
