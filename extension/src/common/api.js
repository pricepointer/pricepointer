const API_VERSION = 1
const baseUrl = `http://127.0.0.1:8000/api/v${API_VERSION}/`

const TOKEN_ACCESS_KEY = 'access'
const TOKEN_REFRESH_KEY = 'refresh'

function getAccessToken() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(TOKEN_ACCESS_KEY, ({ [TOKEN_ACCESS_KEY]: token }) => resolve(token))
    })
}

function setAccessToken(token) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [TOKEN_ACCESS_KEY]: token }, () => resolve())
    })
}

function getRefreshToken() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(TOKEN_REFRESH_KEY, ({ [TOKEN_REFRESH_KEY]: token }) => resolve(token))
    })
}

function setRefreshToken(token) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [TOKEN_REFRESH_KEY]: token }, () => resolve())
    })
}

async function refreshRetry(promise) {
    const refresh = await getRefreshToken()

    // eslint-disable-next-line no-use-before-define
    return post(`accounts/token/refresh/`, {
        refresh,
    })
        .then(({ access }) => setAccessToken(access)
            .then(() => promise), () => {
            // TODO: Handle refresh error later
            console.error('Need to handle this error!')
            return null
        })
}

async function getFetchOptions(headers = {}) {
    const token = await getAccessToken()

    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...headers,
        },
    }
}

function handleFetch(promise) {
    return promise
        .catch((error) => {
            if (error.status === 401 || error.status === 403) {
                return refreshRetry(promise)
            }

            throw error
        })
}

async function request(method, url, { headers = {}, ...options } = {}) {
    const fetchOptions = await getFetchOptions(headers)

    return fetch(`${baseUrl}${url}`, {
        method,
        ...fetchOptions,
        ...options,
    })
        .then((res) => {
            if (res.status >= 400) {
                throw res
            }

            return res.json()
        })
        .catch(res => res.json()
            .then((error) => {
                // eslint-disable-next-line no-throw-literal
                throw {
                    error,
                    status: res.status,
                }
            }))
}

export function getProfile() {
    // eslint-disable-next-line no-use-before-define
    return get(`accounts/me/`)
}

export function login(credentials) {
    // eslint-disable-next-line no-use-before-define
    return post(`accounts/token/`, credentials)
        .then(async ({ access, refresh }) => {
            await Promise.all([
                setAccessToken(access),
                setRefreshToken(refresh),
            ])

            return getProfile()
        }, () => {
            // TODO: Handle refresh error later
            console.error('Need to handle this error!')
            return null
        })
}

export function get(url, options = {}) {
    return handleFetch(request('GET', url, options))
}

export function post(url, data, options = {}) {
    return handleFetch(request('POST', url, {
        ...options,
        body: JSON.stringify(data),
    }))
}
