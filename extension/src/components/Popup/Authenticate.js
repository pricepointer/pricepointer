import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import 'font-awesome/scss/font-awesome.scss'
import SignIn from './Signin'
import SignUp from './Signup'

const styles = {
    container: {
        width: 500,
        height: 330,
        border: '3 #ffffff',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.3s ease',
    },

    button: {
        outline: 'none',
        backgroundColor: '#00C6E8',
        color: '#FFFFFF',
        width: 130,
        height: 35,
        borderRadius: 100,
        border: '2px solid #ffffff',
        borderColor: '#ffffff',
        fontSize: '10px',
        fontWeight: '900',
    },

    buttonCard: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    inputCard: {
        textAlign: 'center',
    },

    input: {
        width: '200px',
        backgroundColor: '#f1f1f1',
        border: 'none',
        height: '30px',
        padding: '0px 8px',
    },

    lightBackground: {
        backgroundColor: '#ffffff',
        width: '50%',
        height: '100%',
    },

    darkBackground: {
        backgroundColor: '#00C6E8',
        color: '#ffffff',
        width: '50%',
        height: '100%',
        textAlign: 'center',
    },

    title: {
        textAlign: 'center',
        paddingTop: '20px',
        fontWeight: '900',
        fontFamily: 'recoleta',
    },

    forgotPassword: {
        color: '#666666',
        margin: '5px',
    },

    informative: {
        marginBottom: '20px',
        marginLeft: '20px',
        marginRight: '20px',
    },

    centerInfo: {
        margin: '25% 0px 25%',
    },

    separator: {
        display: 'inline-flex',
        height: '100%',
    },

    error: {
        color: '#e2302f',
        fontSize: '10px',
        textAlign: 'left',
        margin: '0px 22px 0px',
        height: '14px',
    },
}

class Authenticate extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        handleSignup: PropTypes.func.isRequired,
        emailErrorMessage: PropTypes.string.isRequired,
        nameErrorMessage: PropTypes.string.isRequired,
        passwordErrorMessage: PropTypes.string.isRequired,
        loginErrorMessage: PropTypes.string.isRequired,
        showCheckEmail: PropTypes.bool.isRequired,
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
            classes, emailErrorMessage, nameErrorMessage, passwordErrorMessage, loginErrorMessage, handleSignup,
            handleLogin, showCheckEmail,
        } = this.props
        return (
            <div className={classes.container}>
                {
                    showSignUp
                        ? (

                            // Sign up page
                            <SignUp
                                handleSignup={handleSignup}
                                emailErrorMessage={emailErrorMessage}
                                nameErrorMessage={nameErrorMessage}
                                passwordErrorMessage={passwordErrorMessage}
                                sendToSignIn={this.sendToSignIn}
                                showCheckEmail={showCheckEmail}
                            />
                        )

                        // Sign in page
                        : (
                            <SignIn
                                handleLogin={handleLogin}
                                sendToSignUp={this.sendToSignUp}
                                loginErrorMessage={loginErrorMessage}
                            />
                        )
                }
            </div>
        )
    }
}

export default withStyles(styles)(Authenticate)
