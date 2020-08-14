import PropTypes from 'prop-types'
import React, { Component } from 'react'
import withStyles from 'react-jss'
import { post } from '../../common/api'
import { getElementXPath } from '../helpers'

const productsUrl = 'products/'
const styles = {
    container: {
        width: 350,
        height: 400,
        border: '5px #ffffff',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    titleCard: {
        margin: '10px 10px 10px',
    },
    input: {
        width: '180px',
    },

    inputCard: {
        display: 'flex',
        margin: '20px 0px 20px',
        justifyContent: 'space-between',
    },

    button: {
        outline: 'none',
        backgroundColor: '#FEA127',
        color: '#FFFFFF',
        width: 140,
        height: 50,
        borderRadius: 5,
        border: 'none',
        fontSize: '18px',
    },

    buttonDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },

    closeButton: {
        width: '22px',
        fontSize: '24px',
        fontWeight: 400,
        lineHeight: 0,
        float: 'right',
        border: 'none',
        outline: 'none',
        color: '#ffffff',
        position: 'absolute',
        top: 0,
        right: 0,
        margin: '15px 0px 0px',
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
            showError: false,
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
            this.setState({
                showError: true,
            })
        }
    }

    handleClose = () => {
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
        const {
            name, dayTracker, priceThreshold, showError,
        } = this.state

        return (
            <div className={classes.container}>
                <div
                    style={{
                        backgroundColor: '#FFC85E',
                        height: '50px',
                    }}
                >
                    <div className={classes.titleCard}>
                        <h1
                            style={{
                                color: '#ffffff',
                                textAlign: 'center',
                            }}
                        >
                            Price Point
                        </h1>
                        <p
                            className={classes.closeButton}
                            onClick={this.handleClose}
                        >
                            x
                        </p>
                    </div>
                </div>
                <form style={{ margin: '40px 15px 40px' }}>
                    <div className={classes.inputCard}>
                        <div htmlFor="name">
                            Name
                        </div>
                        <input
                            className={classes.input}
                            type="text"
                            id="name"
                            value={name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className={classes.inputCard}>
                        <div htmlFor="dayTracker">
                            Watch for:
                        </div>
                        <input
                            className={classes.input}
                            type="number"
                            id="dayTracker"
                            value={dayTracker}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className={classes.inputCard}>
                        <div htmlFor="priceThreshold">
                            Desired price:
                        </div>
                        <input
                            className={classes.input}
                            type="number"
                            id="priceThreshold"
                            value={priceThreshold}
                            onChange={this.handleChange}
                        />
                    </div>
                </form>
                {showError && (
                    <div style={{ color: '#b60000', textAlign: 'center' }}> Please enter a price </div>
                )}
                <div className={classes.buttonDiv}>
                    <button
                        type="submit"
                        className={classes.button}
                        onClick={this.priceEnterCheck}
                    >
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Prompt)
