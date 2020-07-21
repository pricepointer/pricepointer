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

        this.state = {
            isTracking: false,
        }
    }

    componentDidMount() {
        // Read from storage or options here
        // chrome.storage.sync.get('color', (data) => {
        //     this.setState({
        //         color: data.color,
        //     })
        // })
    }

    handleClick = () => {
        this.setState((prevState) => {
            const nextState = {
                isTracking: !prevState.isTracking,
            }

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, nextState)
            })

            return nextState
        })
    }

    render() {
        const { classes } = this.props
        const { isTracking } = this.state

        return (
            <div>
                <button
                    className={classes.button}
                    type="button"
                    onClick={this.handleClick}
                >
                    {
                        isTracking
                            ? 'Select price'
                            : 'Click to select price'
                    }
                </button>
            </div>
        )
    }
}

export default withStyles(styles)(Popup)
