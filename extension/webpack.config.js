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
const CreateManifestPlugin = require('./build/CreateManifestPlugin')
const buildManifest = require('./src/build-manifest')

// Path to output directory relative to project root
const OUTPUT_DIR = '_dist/'
const ENTRY_DIR_PATH = 'src/entries'
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
                        filename: `${name}.html`,
                        chunks: [name],
                    }),
                )
            }

            // if (!isProduction && isDevServer) {
            //     entry[name].unshift(
            //         `webpack-dev-server/client?${DEVELOPMENT_SERVER}`,
            //         'webpack/hot/only-dev-server',
            //         // 'react-hot-loader/patch',
            //     )
            // }
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
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: getProjectAbsolutePath('images'), to: 'images' },
            ]
        }),
        new CreateManifestPlugin(buildManifest),
        new WriteFilePlugin(),
    ]

    if (!isProduction) {
        plugins.push(new BundleTracker({ filename: './webpack-stats.json' }))
        plugins.push(new webpack.SourceMapDevToolPlugin({
            // asset matching
            filename: '[file].map',
            exclude: [/node_modules/],

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
            // plugins.push(new webpack.HotModuleReplacementPlugin())

            // babelLoader.options.plugins.push('react-hot-loader/babel')

            devServer = {
                hot: true,
                overlay: true,
            }

            // alias = {
            //     'react-dom': '@hot-loader/react-dom',
            // }
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
        mode: isProduction ? 'production' : 'development',
        cache: true,
        entry: {
            ...entry,
            reloader: path.resolve(path.join(__dirname, 'build/reloader.raw.js')),
        },
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
            // alias,
        },
        devServer,
    }
}

module.exports = buildWebpackConfig()
