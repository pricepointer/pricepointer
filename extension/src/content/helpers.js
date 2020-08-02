export function getElementXPath(element) {
    if (element && element.id) return `//*[@id="${element.id}"]`

    const paths = []

    for (; element && element.nodeType === Node.ELEMENT_NODE;
        element = element.parentNode) {
        let index = 0
        let hasFollowingSiblings = false
        for (let sibling = element.previousSibling; sibling;
            sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === element.nodeName) {
                index += 1
            }
        }

        for (let sibling = element.nextSibling;
            sibling && !hasFollowingSiblings;
            sibling = sibling.nextSibling) {
            if (sibling.nodeName === element.nodeName) {
                hasFollowingSiblings = true
            }
        }

        const tagName = (element.prefix ? `${element.prefix}:` : '')
            + element.localName
        const pathIndex = (index || hasFollowingSiblings ? `[${
            index + 1}]` : '')
        paths.splice(0, 0, tagName + pathIndex)
    }
    return paths.length ? `/${paths.join('/')}` : null
}
