import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import {
    getProfile, login, logout, signup,
} from '../../common/api'
import Header from '../Header'
import CurrentTracks from './CurrentTracks'
import SignIn from './SignIn'
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
        const { user, isLoading, account } = this.state

        if (isLoading) {
            return null
        }

        return (
            <div>
                {
                    !user
                        ? <SignIn handleLogin={this.handleLogin} handleSignup={this.handleSignup} />
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
                                        <div className={classes.container}>
                                            <div> Theme</div>
                                            <input
                                                list="theme"
                                                name="theme"
                                            />
                                            <datalist id="theme" onChange={this.handleThemeChange}>
                                                <option value="Light" />
                                                <option value="Dark" />
                                            </datalist>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                margin: '15px 15px 15px',
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
