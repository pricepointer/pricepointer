import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import {
    getProfile, login, logout, signup,
} from '../../common/api'
import CurrentTracks from './CurrentTracks'
import SignIn from './SignIn'

const max = '100%'
const styles = {
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

    container: {
        width: max,
        height: max,
        margin: '15px 0px 15px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },

    outerContainer: {
        width: 250,
        border: '3 #ffffff',
        display: 'flex',
        flexDirection: 'column',
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
    },

    watchList: {
        justifyContent: 'center',
        alignContent: 'center',
        margin: '30px 10px 10px',
        height: '170px',
        overflowY: 'auto',
    },

    titleCard: {
        margin: '-5px 10px 10px',
    },
}

class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            isLoading: true,
        }
    }

    componentDidMount() {
        getProfile()
            .then((user) => {
                this.setState({
                    user,
                    isLoading: false,
                })
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                })
            })
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

    handleSignup = (accountData) => {
        signup(accountData)
            .then((user) => {
                this.setState({
                    user,
                })
            })
    }

    handleLogin = (email, password) => {
        login({
            email,
            password,
        })
            .then((user) => {
                this.setState({
                    user,
                })
            })
    }

    handleLogout = () => {
        logout()
        this.setState({
            user: null,
        })
    }

    handleClose = () => {
        window.close()
    }

    render() {
        const { classes } = this.props
        const { user, isLoading } = this.state

        if (isLoading) {
            return null
        }

        return (
            <div>
                {
                    !user
                        ? <SignIn handleLogin={this.handleLogin} handleSignup={this.handleSignup} />
                        : (

                            <div className={classes.outerContainer}>
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
                                <div className={classes.watchList}>
                                    <CurrentTracks user={user} />
                                </div>
                                <div className={classes.container}>
                                    <button
                                        className={classes.button}
                                        type="button"
                                        onClick={this.handleClick}
                                    >
                                        Select price
                                    </button>
                                </div>
                            </div>
                        )
                }
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(Popup)
