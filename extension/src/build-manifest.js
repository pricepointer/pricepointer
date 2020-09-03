const pkg = require('../../package.json')

const baseManifest = {
    name: 'Pricepointer',
    description: pkg.description,
    permissions: ['activeTab', 'declarativeContent', 'storage'],
    version: pkg.version,
    manifest_version: 2,
}

const icons = {
    16: 'images/get_started16.png',
    32: 'images/get_started32.png',
    48: 'images/get_started48.png',
    128: 'images/get_started128.png',
}

module.exports = (chunks, assets) => {
    const manifest = {
        ...baseManifest,
        icons,
    }

    manifest.background = {
        scripts: [chunks.background],
        persistent: false,
    }

    manifest.page_action = {
        default_icon: icons,
        default_popup: 'popup.html',
    }

    manifest.options_page = 'options.html'

    const content = Array.from(assets).find(asset => /content\..+\.js$/.test(asset))
    const contentCss = Array.from(assets).find(asset => /content\..+\.css$/.test(asset))
    manifest.content_scripts = [
        {
            matches: ['http://*/*', 'https://*/*'],
            js: [content],
            css: [contentCss],
            all_frames: true,
        },
    ]

    manifest.web_accessible_resources = [
        'images/*',
    ]

    return manifest
}
