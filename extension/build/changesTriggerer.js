/* eslint-disable */
const { parse } = require('useragent')
const { OPEN, Server } = require('ws')
const { zip, debounce, runInContext } = require('lodash')
const { signChange } = require('./signals')

const FAST_RELOAD_CALLS = 6
const FAST_RELOAD_DEBOUNCING_FRAME = 2000
const FAST_RELOAD_WAIT = 10 * 1000
const NEW_FAST_RELOAD_CALLS = 30
const NEW_FAST_RELOAD_CHROME_VERSION = [73, 0, 3637]
const NEW_FAST_RELOAD_DEBOUNCING_FRAME = 1000

const debounceSignal = (deboucingFrame, context) => (func) => {
    if (context) {
        runInContext(context)
    }

    return debounce((...args) => {
        return func.apply(context, args)
    }, deboucingFrame)
}

const fastReloadBlocker = (maxCalls, wait, context) => (func) => {
    let calls = 0
    let inWait = false

    return (...args) => {
        if (inWait) {
            return
        } else if (calls === maxCalls) {
            calls = 0
            inWait = true

            let interval = wait / 1000
            console.warn(
                `Please wait ${interval} secs. for next reload to prevent your extension being blocked`,
            )
            const logInterval = setInterval(() => console.warn(`${--interval} ...`), 1000)

            setTimeout(() => {
                clearInterval(logInterval)
                console.info('Signing for reload now')
                func.apply(context, args)
                inWait = false
            }, wait)
        } else {
            calls++
            return func.apply(context, args)
        }
    }
}

class SignEmitter {
    constructor(server, { family, major, minor, patch }) {
        this._server = server
        if (family === 'Chrome') {
            const [reloadCalls, reloadDeboucingFrame] = this._satisfies(
                [parseInt(major, 10), parseInt(minor, 10), parseInt(patch, 10)],
                NEW_FAST_RELOAD_CHROME_VERSION,
            )
                ? [NEW_FAST_RELOAD_CALLS, NEW_FAST_RELOAD_DEBOUNCING_FRAME]
                : [FAST_RELOAD_CALLS, FAST_RELOAD_DEBOUNCING_FRAME]

            const debouncer = debounceSignal(reloadDeboucingFrame, this)
            const blocker = fastReloadBlocker(reloadCalls, FAST_RELOAD_WAIT, this)
            this._safeSignChange = debouncer(blocker(this._setupSafeSignChange()))
        } else {
            this._safeSignChange = this._setupSafeSignChange()
        }
    }

    safeSignChange(
        reloadPage,
        onlyPageChanged,
    ) {
        return new Promise((res, rej) => {
            this._safeSignChange(reloadPage, onlyPageChanged, res, rej)
        })
    }

    _setupSafeSignChange() {
        return (
            reloadPage,
            onlyPageChanged,
            onSuccess,
            onError,
        ) => {
            try {
                this._sendMsg(signChange({ reloadPage, onlyPageChanged }))
                onSuccess()
            } catch (err) {
                onError(err)
            }
        }
    }

    _sendMsg(msg) {
        this._server.clients.forEach(client => {
            if (client.readyState === OPEN) {
                client.send(JSON.stringify(msg))
            }
        })
    }

    _satisfies(
        browserVersion,
        targetVersion,
    ) {
        const versionPairs = zip(browserVersion, targetVersion)

        for (const [version = 0, target = 0] of versionPairs) {
            if (version !== target) {
                return version > target
            }
        }
        return true
    }
}

class HotReloaderServer {
    constructor(port) {
        this._server = new Server({ port })
    }

    listen() {
        this._server.on('connection', (ws, msg) => {
            const userAgent = parse(msg.headers['user-agent'])
            this._signEmitter = new SignEmitter(this._server, userAgent)

            ws.on('message', (data) =>
                console.info(`Message from ${userAgent.family}: ${JSON.parse(data).payload}`),
            )
            ws.on('error', () => {
                // NOOP - swallow socket errors due to http://git.io/vbhSN
            })
        })
    }

    signChange(
        reloadPage,
        onlyPageChanged,
    ) {
        if (this._signEmitter) {
            return this._signEmitter.safeSignChange(reloadPage, onlyPageChanged)
        } else {
            return Promise.resolve(null)
        }
    }
}

const changesTriggerer = (
    port,
    reloadPage,
) => {
    const server = new HotReloaderServer(port)

    console.info('[ Starting the Hot Extension Reload Server... ]')
    server.listen()

    return (onlyPageChanged) => server.signChange(reloadPage, onlyPageChanged)
}

module.exports = changesTriggerer
