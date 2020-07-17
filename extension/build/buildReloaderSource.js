/* eslint-disable */
const fs = require('fs')
const { template } = require('lodash')
const { RawSource } = require('webpack-sources')
const signals = require('./signals')

const RECONNECT_INTERVAL = 2000
const SOCKET_ERR_CODE_REF = 'https://tools.ietf.org/html/rfc6455#section-7.4.1'

function readModuleFile(path, callback) {
    const filename = require.resolve(path)
    return fs.readFileSync(filename, 'utf8')
}

const rawSource = readModuleFile('./reloader.compiled')
const polyfillSource = readModuleFile('webextension-polyfill')

module.exports = function buildReloaderSource(
    {
        port,
        reloadPage,
    },
) {
    const tmpl = template(rawSource)

    return new RawSource(
        tmpl({
            WSHost: `ws://localhost:${port}`,
            config: JSON.stringify({ RECONNECT_INTERVAL, SOCKET_ERR_CODE_REF }),
            polyfillSource: `"||${polyfillSource}"`,
            reloadPage: `${reloadPage}`,
            signals: JSON.stringify(signals),
        }),
    )
}
