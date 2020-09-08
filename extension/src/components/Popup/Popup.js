import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { getProfile, login, logout } from '../../common/api'
import Header from '../Header'
import Authenticate from './Authenticate/Authenticate'
import CurrentTracks from './CurrentTracks'
import 'font-awesome/scss/font-awesome.scss'

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
}

class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            isLoading: true,
            loginError: '',
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

    handleLogin = (email, password) => {
        login({
            email,
            password,
        })
            .then((user) => {
                this.setState({
                    user,
                })
            }, () => {
                this.setState({
                    loginError: 'Username or password is incorrect',
                })
            })
    }

    handleClearLoginError = () => {
        this.setState({
            loginError: '',
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
        const {
            user, isLoading, loginError,
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
                                loginError={loginError}
                                handleClearLoginError={this.handleClearLoginError}
                            />
                        )
                        : (
                            <div className={classes.outerContainer}>
                                <Header
                                    handleClose={this.handleClose}
                                    icon="sign-out"
                                    iconHandler={this.handleLogout}
                                    iconTitle="Sign out"
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
                }
            </div>
        )
    }
}

export default withStyles(styles)(Popup)
