import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import Signin from './Signin'
import Signup from './Signup'

const styles = {
    container: {
        width: 500,
        height: 360,
        border: '3 #ffffff',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.3s ease',
    },
}

class Authenticate extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        handleClearLoginError: PropTypes.func.isRequired,
        loginError: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            showSignUp: false,
        }
    }

    sendToSignUp = () => {
        this.setState({
            showSignUp: true,
        })
    }

    sendToSignIn = () => {
        this.setState({
            showSignUp: false,
        })
    }

    render() {
        const {
            showSignUp,
        } = this.state
        const {
            classes,
            loginError,
            handleLogin,
            handleClearLoginError,
        } = this.props
        return (
            <div className={classes.container}>
                {
                    showSignUp
                        ? (

                            // Sign up page
                            <Signup
                                sendToSignIn={this.sendToSignIn}
                            />
                        )

                        // Sign in page
                        : (
                            <Signin
                                handleLogin={handleLogin}
                                handleClearLoginError={handleClearLoginError}
                                sendToSignUp={this.sendToSignUp}
                                error={loginError}
                            />
                        )
                }
            </div>
        )
    }
}

export default withStyles(styles)(Authenticate)
