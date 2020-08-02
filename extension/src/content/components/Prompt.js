import PropTypes from 'prop-types'
import React, { Component } from 'react'
import withStyles from 'react-jss'
import { getElementXPath } from '../helpers'

const productsUrl = 'http://127.0.0.1:8000/products/'

const styles = {
    container: {
        width: 200,
        height: 250,
        background: '#ffffff',
    },
    input: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
    },
}

function generateProduct(target, priceThreshold, dayTracker, givenName) {
    const xpath = getElementXPath(target)
    const web = document.URL
    const data = {
        user: 1,
        website: web,
        price_path: xpath,
        target_price: priceThreshold,
        notification_period: dayTracker,
        name: givenName,
    }


    fetch(productsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(() => {
            console.log('Success:', data)
        })
        .catch((error) => {
            console.error('Error', error)
        })
}

class Prompt extends Component {
    static propTypes = {
        target: PropTypes.node.isRequired,
        handleClose: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            dayTracker: 7,
            priceThreshold: '',
            name: '',
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    priceEnterCheck = () => {
        const { priceThreshold } = this.state
        if (priceThreshold) {
            this.handleClick()
        } else {
            alert('Please enter a valid price threshold')
        }
    }

    handleCancel = () => {
        const { handleClose } = this.props
        handleClose()
    }

    handleClick = () => {
        const { target, handleClose } = this.props
        const { priceThreshold, dayTracker, name } = this.state
        generateProduct(target, priceThreshold, dayTracker, name)
        chrome.runtime.sendMessage({
            toggleInfoEntered: true,
            dayTracker,
            priceThreshold,
        })
        handleClose()
    }

    render() {
        const { classes } = this.props
        const { name, dayTracker, priceThreshold } = this.state

        return (
            <div className={classes.container}>
                <h1> Drop Shop</h1>
                <form>
                    <label htmlFor="name">
                        Name of tracked object:
                        <input
                            className={classes.input}
                            type="text"
                            id="name"
                            value={name}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label htmlFor="dayTracker">
                        Days to track:
                        <input
                            className={classes.input}
                            type="number"
                            id="dayTracker"
                            value={dayTracker}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label htmlFor="priceThreshold">
                        Notify me at:
                        <input
                            className={classes.input}
                            type="number"
                            id="priceThreshold"
                            value={priceThreshold}
                            onChange={this.handleChange}
                        />
                    </label>
                </form>

                <button
                    type="submit"
                    onClick={this.priceEnterCheck}
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={this.handleCancel}
                >
                    Cancel
                </button>
            </div>
        )
    }
}

export default withStyles(styles)(Prompt)
