const SIGN_CHANGE = 'SIGN_CHANGE'
const SIGN_RELOAD = 'SIGN_RELOAD'
const SIGN_RELOADED = 'SIGN_RELOADED'
const SIGN_LOG = 'SIGN_LOG'
const SIGN_CONNECT = 'SIGN_CONNECT'

const signChange = ({
    reloadPage = true,
    onlyPageChanged = false,
}) => ({
    payload: { reloadPage, onlyPageChanged },
    type: SIGN_CHANGE,
})
const signReload = () => ({ type: SIGN_RELOAD })
const signReloaded = msg => ({
    payload: msg,
    type: SIGN_RELOADED,
})
const signLog = msg => ({
    payload: msg,
    type: SIGN_LOG,
})


module.exports = {
    SIGN_CHANGE,
    SIGN_RELOAD,
    SIGN_RELOADED,
    SIGN_LOG,
    SIGN_CONNECT,
    signChange,
    signReload,
    signReloaded,
    signLog,
}
