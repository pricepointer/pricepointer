import React from 'react'
import ReactDOM from 'react-dom'
import Popup from '../src/components/Popup/Popup'

it('rendered without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Popup />, div)
    ReactDOM.unmountComponentAtNode(div)
})

describe('math test', () => {
    test('2 + 2 is 4', () => {
        expect(2 + 2).toBe(4)
    })
})
