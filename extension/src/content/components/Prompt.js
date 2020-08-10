import PropTypes from 'prop-types'
import React, { Component } from 'react'
import withStyles from 'react-jss'
import { post } from '../../common/api'
import { getElementXPath } from '../helpers'

const productsUrl = 'products/'
const styles = {
    container: {
        width: 170,
        height: 265,
        background: '#2d2d2d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        border: 'none',
        borderBottom: '2px solid #ffffff',
        backgroundColor: '#1f1f1f',
    },
    button: {
        outline: 'none',
        backgroundColor: '#0fdccd',
        width: 75,
        height: 40,
        borderRadius: 10,
    },

    buttonDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },

    whiteText: {
        color: '#ffffff',
    },

    title: {
        color: '#0fdccd',
    },
    inputCard: {
        alignItems: 'center',
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


    post(productsUrl, data)
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
                <h1 className={classes.title}> Price Point</h1>
                <form>
                    <div className={classes.inputCard}>
                        <label className={classes.whiteText} htmlFor="name">
                            Name of tracked object:
                            <input
                                className={classes.input}
                                type="text"
                                id="name"
                                value={name}
                                onChange={this.handleChange}
                            />
                        </label>
                    </div>
                    <div className={classes.inputCard}>
                        <label className={classes.whiteText} htmlFor="dayTracker">
                            Days to track:
                            <input
                                className={classes.input}
                                type="number"
                                id="dayTracker"
                                value={dayTracker}
                                onChange={this.handleChange}
                            />
                        </label>
                    </div>
                    <div className={classes.inputCard}>
                        <label className={classes.whiteText} htmlFor="priceThreshold">
                            Notify me at:
                            <input
                                className={classes.input}
                                type="number"
                                id="priceThreshold"
                                value={priceThreshold}
                                onChange={this.handleChange}
                            />
                        </label>
                    </div>
                </form>
                <div className={classes.buttonDiv}>
                    <button
                        type="submit"
                        className={classes.button}
                        onClick={this.priceEnterCheck}
                    >
                        Submit
                    </button>
                    <button
                        className={classes.button}
                        type="button"
                        onClick={this.handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Prompt)
