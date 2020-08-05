const API_VERSION = 1
const baseUrl = `http://127.0.0.1:8000/api/v${API_VERSION}/`

export function get(url, options) {
    return fetch(`${baseUrl}${url}`, options)
        .then(res => res.json())
}

export function post(url, data, options) {
    return fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        ...options,
    })
        .then(res => res.json())
}