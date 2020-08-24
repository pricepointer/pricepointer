import { createPopper } from '@popperjs/core'
import React from 'react'
import ReactDOM from 'react-dom'
import buildStyles from './buildStyles'
import Prompt from './components/Prompt'

// state
let isToggled = false
let stylesheet = null
let overlay = null
let highlight = null
let hoveredElement = null

const styles = {
    highlighted: {
        position: 'fixed',
        background: 'rgba(0,198,232,0.20) !important',
        border: '1px solid #00c6e8 !important',
        zIndex: 999999999999,
        pointerEvents: 'none',
    },
    overlay: {
        position: 'fixed',
        background: 'rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 999999999999,
    },
}

function resetState() {
    isToggled = false
    stylesheet = null
    overlay = null
    highlight = null
    hoveredElement = null
}

function setElementRect(element, {
    width, height, top, left, bottom = null, right = null, fullscreen = false, hide = false,
}) {
    if (fullscreen) {
        element.style.width = null
        element.style.height = null
        element.style.top = `${0}px`
        element.style.left = `${0}px`
        element.style.bottom = `${0}px`
        element.style.right = `${0}px`
    } else if (hide) {
        element.style.width = `${0}px`
        element.style.height = `${0}px`
        element.style.top = null
        element.style.left = null
        element.style.bottom = null
        element.style.right = null
    } else {
        element.style.width = width != null ? `${width}px` : null
        element.style.height = height != null ? `${height}px` : null
        element.style.top = top != null ? `${top}px` : null
        element.style.left = left != null ? `${left}px` : null
        element.style.bottom = bottom != null ? `${bottom}px` : null
        element.style.right = right != null ? `${right}px` : null
    }
}

function updateOverlay() {
    if (!overlay) return

    if (hoveredElement) {
        const clientRect = hoveredElement.getBoundingClientRect()
        const rect = {
            top: clientRect.top,
            bottom: clientRect.bottom,
            left: clientRect.left,
            right: clientRect.right,
            height: clientRect.height,
            width: clientRect.width,
        }
        Object.keys(rect)
            .forEach((prop) => {
                rect[prop] = Math.max(rect[prop], 0)
            })

        setElementRect(overlay.top, {
            top: 0,
            height: rect.top,
            left: 0,
            right: 0,
        })
        setElementRect(overlay.left, {
            top: rect.top,
            height: rect.bottom - rect.top,
            width: rect.left,
            left: 0,
        })
        setElementRect(overlay.right, {
            top: rect.top,
            height: rect.bottom - rect.top,
            left: rect.right,
            right: 0,
        })
        setElementRect(overlay.bottom, {
            top: rect.bottom,
            bottom: 0,
            left: 0,
            right: 0,
        })
    } else {
        setElementRect(overlay.top, { fullscreen: true })
        setElementRect(overlay.left, { hide: true })
        setElementRect(overlay.right, { hide: true })
        setElementRect(overlay.bottom, { hide: true })
    }
}

function updateHighlightBoundaries() {
    // Using the current hovered element, update the boundaries of the highlight
    if (!hoveredElement || !highlight) return

    const rect = hoveredElement.getBoundingClientRect()
    setElementRect(highlight, rect)
    updateOverlay()
}

function renderPopup(element) {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)

    function closePopup() {
        document.body.removeChild(wrapper)
    }

    ReactDOM.render(
        <React.StrictMode>
            <Prompt
                target={element}
                handleClose={closePopup}
            />
        </React.StrictMode>,
        wrapper,
    )
    createPopper(element, wrapper)
    wrapper.style.zIndex = 10000000000
}

function renderError(element) {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)

    function closePopup() {
        document.body.removeChild(wrapper)
    }

    ReactDOM.render(
        <React.StrictMode>
            <div
                style={{
                    color: '#b60000',
                    backgroundColor: '#ffffff',
                    zIndex: '99999',
                    fontSize: '10px',
                }}
            >
                Error: please select the price of the item you would like to track
            </div>
        </React.StrictMode>,
        wrapper,
    )
    createPopper(element, wrapper, {
        placement: 'top',
    })
    wrapper.style.zIndex = 10000000000
    setTimeout(closePopup, 5000)
}

function handlePriceClick(event) {
    // eslint-disable-next-line no-use-before-define
    leavePriceSelection()
    const isPrice = event.target.innerText
    console.log(isPrice)
    if (isPrice.includes('$') || isPrice.includes('£') || isPrice.includes('€') || isPrice.includes('¥')
        || isPrice.includes('₾')) {
        renderPopup(event.target)
    } else {
        renderError(event.target)
    }

    event.preventDefault()
    event.stopPropagation()
}

function handlePriceMouseOver(event) {
    hoveredElement = event.target

    // set highlight boundaries
    updateHighlightBoundaries()
    highlight.classList.add(stylesheet.classes.highlighted)
}

function handlePriceMouseOut(event) {
    hoveredElement = event.target
    highlight.classList.remove(stylesheet.classes.highlighted)
}

function handleKeyDown(event) {
    if (event.keyCode === 27) { // esc
        // eslint-disable-next-line no-use-before-define
        leavePriceSelection()
    }
}

export function enterPriceSelection() {
    if (isToggled) return
    resetState()

    isToggled = true
    stylesheet = buildStyles(styles)

    // build overlay
    overlay = {
        top: document.createElement('div'),
        bottom: document.createElement('div'),
        right: document.createElement('div'),
        left: document.createElement('div'),
    }

    Object.values(overlay)
        .forEach((el) => {
            el.classList.add(stylesheet.classes.overlay)
            document.body.appendChild(el)
        })
    updateOverlay()

    highlight = document.createElement('div')
    document.body.appendChild(highlight)

    document.addEventListener('mouseover', handlePriceMouseOver)
    document.addEventListener('mouseout', handlePriceMouseOut)
    document.addEventListener('click', handlePriceClick)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('scroll', updateHighlightBoundaries)
}

export function leavePriceSelection() {
    if (stylesheet) {
        stylesheet.detach() // and remove all styles
    }

    if (overlay) {
        // remove overlay
        Object.values(overlay)
            .forEach((el) => {
                el.parentNode.removeChild(el)
            })
    }

    if (highlight) {
        highlight.parentNode.removeChild(highlight)
    }

    document.removeEventListener('mouseover', handlePriceMouseOver)
    document.removeEventListener('mouseout', handlePriceMouseOut)
    document.removeEventListener('click', handlePriceClick)
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('scroll', updateHighlightBoundaries)

    resetState()
}
