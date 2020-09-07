import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import {
    getProfile, login, logout, signup,
} from '../../common/api'
import Header from '../Header'
import Authenticate from './Authenticate'
import CurrentTracks from './CurrentTracks'
import 'font-awesome/scss/font-awesome.scss'


// eslint-disable-next-line no-unused-vars
let themeColor = 'Light'

const max = '100%'
const styles = {
    button: {
        outline: 'none',
        backgroundColor: '#00C6E8',
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
        width: 400,
        border: '3 #ffffff',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f1f1f1',
    },

    settingsContainer: {
        width: 250,
        border: '3 #ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: 200,
    },
}

class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            isLoading: true,
            account: false,
            emailErrorMessage: '',
            nameErrorMessage: '',
            passwordErrorMessage: '',
            loginErrorMessage: '',
            showCheckEmail: false,
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
            window.close()
        })
    }

    handleSignup = (accountData) => {
        signup(accountData)
            .then(() => {
                this.setState({
                    showCheckEmail: true,
                })
            })
            .catch((errors) => {
                this.setState({
                    emailErrorMessage: errors.error.email,
                    nameErrorMessage: errors.error.name,
                    passwordErrorMessage: errors.error.password,
                    showCheckEmail: false,
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
                    account: false,
                })
            }, () => {
                this.setState({
                    loginErrorMessage: 'Username or password is incorrect',
                })
            })
    }

    handleLogout = () => {
        logout()
        this.setState({
            user: null,
        })
    }

    handleThemeChange = (event) => {
        themeColor = event
    }

    handleClose = () => {
        window.close()
    }

    handleAccount = () => {
        const { account } = this.state
        if (account === false) {
            this.setState({
                account: true,
            })
        } else {
            this.setState({
                account: false,
            })
        }
    }

    render() {
        const { classes } = this.props
        const {
            user, isLoading, account, emailErrorMessage, nameErrorMessage, passwordErrorMessage, loginErrorMessage,
            showCheckEmail,
        } = this.state

        if (isLoading) {
            return null
        }

        return (
            <div>
                {
                    !user
                        ? (
                            <Authenticate
                                handleLogin={this.handleLogin}
                                handleSignup={this.handleSignup}
                                emailErrorMessage={emailErrorMessage}
                                nameErrorMessage={nameErrorMessage}
                                passwordErrorMessage={passwordErrorMessage}
                                loginErrorMessage={loginErrorMessage}
                                showCheckEmail={showCheckEmail}
                            />
                        )
                        : (

                            !account
                                ? (
                                    <div className={classes.outerContainer}>
                                        <Header
                                            handleClose={this.handleClose}
                                            icon="cog"
                                            iconHandler={this.handleAccount}
                                            iconTitle="Account settings"
                                        />
                                        <CurrentTracks user={user} />
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
                                : (
                                    <div className={classes.settingsContainer}>
                                        <Header
                                            handleClose={this.handleClose}
                                            icon="arrow-left"
                                            iconHandler={this.handleAccount}
                                            iconTitle="Back"
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                margin: 'auto',
                                            }}
                                        >
                                            <button
                                                className={classes.button}
                                                onClick={this.handleLogout}
                                                type="button"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )
                        )
                }
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(Popup)
