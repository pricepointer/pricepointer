import { appIdentifier } from '../../constants'
import { enterPriceSelection } from './price-selection'


chrome.runtime.onMessage.addListener(
    ({ toggleSelectPrice }) => {
        if (toggleSelectPrice) {
            enterPriceSelection()
        }
        return true
    },
)

const wrapper = document.createElement('div')
wrapper.setAttribute('id', appIdentifier)
document.body.appendChild(wrapper)
