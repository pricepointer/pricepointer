import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import 'font-awesome/scss/font-awesome.scss'
import withStyles from 'react-jss'

const styles = {

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
        border: '1px solid white',
        height: '30px',
        padding: '0px 8px',
    },

    errorInput: {
        width: '200px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #e2302f',
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

class SignIn extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        sendToSignUp: PropTypes.func.isRequired,
        loginErrorMessage: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            password: '',
            email: '',
            showForgotPassword: false,
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    handleLogin = () => {
        const { handleLogin } = this.props
        const { email, password } = this.state

        handleLogin(email, password)
    }

    handleClose = () => {
        window.close()
    }

    handleShowForgotPassword = () => {
        const { showForgotPassword } = this.state
        if (showForgotPassword === false) {
            this.setState({
                showForgotPassword: true,
            })
        } else {
            this.setState({
                showForgotPassword: false,
            })
        }
    }

    render() {
        const {
            email, password, showForgotPassword,
        } = this.state
        const {
            classes, sendToSignUp, loginErrorMessage,
        } = this.props
        return (
            <div
                className={classes.separator}
            >
                <div className={classes.lightBackground}>
                    <h1 className={classes.title}>Sign In</h1>
                    {!showForgotPassword ? (
                        <div>
                            <div className={classes.inputCard}>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    className={classes.input}
                                    placeholder="Email"
                                />
                                <div className={classes.error} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    className={!loginErrorMessage ? classes.input : classes.errorInput}
                                    placeholder="Password"
                                />
                            </div>
                            <div className={classes.error}>
                                {!!loginErrorMessage
                                && (
                                    <div>
                                        {loginErrorMessage}
                                    </div>
                                )}
                            </div>
                            <div className={classes.buttonCard}>
                                <a
                                    className={classes.forgotPassword}
                                    onClick={this.handleShowForgotPassword}
                                    role="button"
                                    tabIndex={0}
                                >
                                    Forgot your
                                    password?
                                </a>
                                <button
                                    type="button"
                                    onClick={this.handleLogin}
                                    className={classes.button}
                                >
                                    SIGN IN
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={classes.inputCard}>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={this.handleChange}
                                className={classes.input}
                                placeholder="Email"
                            />
                            <div className={classes.buttonCard}>
                                <a
                                    onClick={this.handleShowForgotPassword}
                                    role="button"
                                    tabIndex={0}
                                    className={classes.forgotPassword}
                                >
                                    {' '}
                                    Go back
                                    {' '}
                                </a>
                                <button type="button" className={classes.button}> SUBMIT</button>
                            </div>
                        </div>
                    )
                    }
                </div>
                <div className={classes.darkBackground}>
                    <div className={classes.centerInfo}>
                        <h1 className={classes.title}>Hello, Friend!</h1>
                        <p className={classes.informative}>
                            Create an account and begin tracking products
                            now!
                        </p>
                        <button
                            type="button"
                            onClick={sendToSignUp}
                            className={classes.button}
                        >
                            SIGN UP
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(SignIn)
