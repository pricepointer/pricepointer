import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

function removeClassName(className) {
    const elements = document.querySelectorAll(`.${className}`)
    Array.from(elements).forEach((element) => {
        element.classList.remove(className)
    })
}

function removeAllClassNames(classNames) {
    classNames.forEach((className) => {
        removeClassName(className)
    })
}

export default function buildStyles(styles) {
    const sheet = jss.createStyleSheet(styles)

    sheet.attach()
    return {
        classes: sheet.classes,
        detach: () => {
            removeAllClassNames(Object.values(sheet.classes))
            sheet.detach()
        },
        removeClassName,
        removeAllClassNames,
    }
}
