import React, { PureComponent } from 'react'
import withStyles from 'react-jss'

const styles = {
    button: {
        outline: 'none',
    },
}

class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {}
    }

    handleClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { toggleSelectPrice: true })
        })

        window.close()
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <button
                    className={classes.button}
                    type="button"
                    onClick={this.handleClick}
                >
                    Select price
                </button>
            </div>
        )
    }
}

export default withStyles(styles)(Popup)
