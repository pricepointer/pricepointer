import React, { PureComponent } from 'react'
import withStyles from 'react-jss'

const styles = {
    button: {
        height: 30,
        width: 30,
        outline: 'none',
    },
}

class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            color: null,
        }

        chrome.storage.sync.get('color', (data) => {
            this.setState({
                color: data.color,
            })
        })
    }

    handleClick = () => {
        const { color } = this.state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.executeScript(
                tabs[0].id,
                { code: `document.body.style.backgroundColor = "${color}";` },
            )
        })
    }

    render() {
        const { classes } = this.props
        const { color } = this.state

        if (!color) return null

        return (
            <div>
                <button
                    className={classes.button}
                    type="button"
                    value={color}
                    style={{ backgroundColor: color }}
                    onClick={this.handleClick}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Popup)
