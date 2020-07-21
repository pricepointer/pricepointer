function handlePriceClick(event) {
    console.log(event)
}

chrome.runtime.onMessage.addListener(
    ({ isTracking }) => {
        if (isTracking) {
            document.addEventListener('click', handlePriceClick)
        } else {
            document.removeEventListener('click', handlePriceClick)
        }

        return true
    },
)
