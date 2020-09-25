const pkg = require('../../package.json')

const baseManifest = {
    name: 'Pricepointer',
    description: pkg.description,
    permissions: ['activeTab', 'declarativeContent', 'storage'],
    version: pkg.version,
    manifest_version: 2,
}

const icons = {
    16: 'images/favicon-16x16.png',
    32: 'images/favicon-32x32.png',
    48: 'images/favicon-48x48.png',
    128: 'images/favicon-128x128.png',
}

module.exports = (compiler, compilation, chunks, assets) => {
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

    const content = Array.from(assets)
        .find(asset => /content\..+\.js$/.test(asset))
    const contentCss = Array.from(assets)
        .find(asset => /content\..+\.css$/.test(asset))
    manifest.content_scripts = [
        {
            matches: ['http://*/*', 'https://*/*'],
            js: content ? [content] : [],
            css: contentCss ? [contentCss] : [],
            all_frames: true,
        },
    ]

    let webAccessibleResources = [
        'images/*',
        'fonts/*',
    ]

    const iframeContentCss = Array.from(assets)
        .find(asset => /iframe\..+\.css$/.test(asset))
    if (iframeContentCss.length) {
        webAccessibleResources = webAccessibleResources.concat(iframeContentCss)
    }

    manifest.web_accessible_resources = webAccessibleResources

    return manifest
}
