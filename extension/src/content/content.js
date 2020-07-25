import { enterPriceSelection } from './price-selection'

chrome.runtime.onMessage.addListener(
    ({ toggleSelectPrice }) => {
        if (toggleSelectPrice) {
            enterPriceSelection()
        }
        return true
    },
)
