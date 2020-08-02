import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import CurrentTracks from './CurrentTracks'
import SignUp from './SignUp'

const styles = {
    button: {
        outline: 'none',
    },
    input: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
    },
}


class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    handleClick = () => {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, (tabs) => {
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
                <CurrentTracks />
                <SignUp />
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(Popup)
