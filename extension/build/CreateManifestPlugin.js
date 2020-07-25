/* eslint-disable */
const { version } = require('webpack')
const { ConcatSource } = require('webpack-sources')
const CompilerEventsFacade = require('./CompilerEventsFacade')
const changesTriggerer = require('./changesTriggerer')
const buildReloaderSource = require('./buildReloaderSource')

const NAME = 'CreateManifestPlugin'

module.exports = class CreateManifestPlugin {
    constructor(builder) {
        this.builder = builder
        this.chunkVersions = {}
    }

    _isWebpackGToEV4() {
        if (version) {
            const [major] = version.split('.')
            if (parseInt(major, 10) >= 4) {
                return true
            }
        }
        return false
    }

    _whatChanged(
        chunks,
        { background, contentScript, extensionPage },
    ) {
        const changedChunks = chunks.filter(({ name, hash }) => {
            const oldVersion = this.chunkVersions[name]
            this.chunkVersions[name] = hash
            return hash !== oldVersion
        })

        const contentOrBgChanged = changedChunks.some(({ name }) => {
            let contentChanged
            const bgChanged = name === background

            if (Array.isArray(contentScript)) {
                contentChanged = contentScript.some(script => script === name)
            } else {
                contentChanged = name === contentScript
            }

            return contentChanged || bgChanged
        })

        const onlyPageChanged =
            !contentOrBgChanged &&
            changedChunks.some(({ name }) => {
                let pageChanged = false

                if (Array.isArray(extensionPage)) {
                    pageChanged = extensionPage.some(script => script === name)
                } else {
                    pageChanged = name === extensionPage
                }

                return pageChanged
            })

        return { contentOrBgChanged, onlyPageChanged }
    }

    apply(compiler) {
        if (typeof this.builder !== 'function') {
            throw new TypeError('CreateManifestPlugin callback should be a `function`.')
        }

        const entries = {
            background: 'background',
            contentScript: ['popup', 'content'],
            extensionPage: '',
        }
        const reloadPage = true
        const port = 9090

        if (
            (this._isWebpackGToEV4()
                ? compiler.options.mode
                : process.env.NODE_ENV) === 'development'
        ) {
            const eventApi = new CompilerEventsFacade(compiler, NAME)

            eventApi.afterOptimizeChunkAssets((compilation, chunks) => {
                const { background, contentScript, extensionPage, } = entries
                const matchesEntry = (name) =>
                    name === background ||
                    name === contentScript || (contentScript && contentScript.includes(name)) ||
                    name === extensionPage || (extensionPage && extensionPage.includes(name))

                const reloadingSource = buildReloaderSource({ port, reloadPage })
                compilation.assets = {
                    ...compilation.assets,
                    ...chunks.reduce((prev, { name, files }) => {
                        if (matchesEntry(name)) {
                            files.forEach(entryPoint => {
                                if (/\.js$/.test(entryPoint)) {
                                    prev[entryPoint] = new ConcatSource(reloadingSource, compilation.assets[entryPoint])
                                }
                            })
                        }

                        return prev
                    }, {}),
                }
            })

            const triggerer = changesTriggerer(port, reloadPage)
            eventApi.afterEmit((comp, done) => {
                const { contentOrBgChanged, onlyPageChanged } = this._whatChanged(
                    comp.chunks,
                    entries,
                )

                if (contentOrBgChanged || onlyPageChanged) {
                    triggerer(onlyPageChanged)
                        .then(done)
                        .catch(done)
                }
            })
        }

        compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
            const chunks = {}
            compilation.chunks.forEach(chunk => {
                chunks[chunk.name] = chunk.files.length ? chunk.files[0] : null
            })

            const assets = new Set(Object.keys(compilation.assets))
            const jsonString = JSON.stringify(this.builder(chunks, assets), null, 2)
            compilation.assets['manifest.json'] = {
                source: () => jsonString,
                size: () => jsonString.length
            }

            callback()
        })
    }
}
