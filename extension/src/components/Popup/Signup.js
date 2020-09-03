import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import 'font-awesome/scss/font-awesome.scss'
import withStyles from 'react-jss'
import peoplejumpingImageUrl from '../../../images/peoplejumping.png'

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

    emailSent: {
        fontSize: '16px',
        padding: '8px',
        marginBottom: '20px',
    },

    image: {
        width: 200,
        height: 'auto',
        margin: '10px 10%',
    },
}

class SignUp extends PureComponent {
    static propTypes = {
        handleSignup: PropTypes.func.isRequired,
        emailErrorMessage: PropTypes.string.isRequired,
        nameErrorMessage: PropTypes.string.isRequired,
        passwordErrorMessage: PropTypes.string.isRequired,
        sendToSignIn: PropTypes.func.isRequired,
        showCheckEmail: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            password: '',
            email: '',
            confirmPassword: '',
            passwordError: false,
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    validation = () => {
        const { handleSignup } = this.props
        const { name, email, password } = this.state
        handleSignup({
            name,
            password,
            email,
        })
    }

    handlePasswordCheck = () => {
        const { password, confirmPassword } = this.state
        this.setState({
            passwordError: false,
        })
        if (confirmPassword !== password) {
            this.setState({
                passwordError: true,
            })
        }
        this.validation()
    }

    handleClose = () => {
        window.close()
    }

    render() {
        const {
            email, password, name, confirmPassword, passwordError,
        } = this.state
        const {
            classes, emailErrorMessage, nameErrorMessage, passwordErrorMessage, sendToSignIn, showCheckEmail,
        } = this.props
        return (
            <div className={classes.separator}>
                <div className={classes.lightBackground}>
                    <h1 className={classes.title}> Sign up</h1>
                    {showCheckEmail
                    && (
                        <div>
                            <div className={classes.emailSent}>A confirmation email was sent!</div>
                            <div className={classes.informative}>Please check your email and sign in</div>

                            <img
                                src={peoplejumpingImageUrl}
                                className={classes.image}
                                alt="Jumping"
                                title="jumping"
                            />
                        </div>
                    )}
                    {!showCheckEmail
                    && (
                        <div>
                            <div className={classes.inputCard}>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={this.handleChange}
                                    className={!nameErrorMessage ? classes.input : classes.errorInput}
                                    placeholder="Full name"
                                />
                                <div className={classes.error}>
                                    {!!nameErrorMessage
                                    && (
                                        <div>
                                            {nameErrorMessage}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    className={!emailErrorMessage ? classes.input : classes.errorInput}
                                    placeholder="Email"
                                />
                                <div className={classes.error}>
                                    {!!emailErrorMessage
                                    && (
                                        <div>
                                            {emailErrorMessage}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    className={!passwordErrorMessage ? classes.input : classes.errorInput}
                                    placeholder="Password"
                                />
                                <div className={classes.error}>
                                    {!!passwordErrorMessage
                                    && (
                                        <div>
                                            {passwordErrorMessage}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={this.handleChange}
                                    className={!passwordError ? classes.input : classes.errorInput}
                                    placeholder="Confirm password"
                                />
                                <div className={classes.error}>
                                    {passwordError && <div>Passwords do not match</div>}
                                </div>
                            </div>
                            <div className={classes.buttonCard}>
                                <button
                                    type="button"
                                    onClick={this.handlePasswordCheck}
                                    className={classes.button}
                                >
                                    SIGN UP
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className={classes.darkBackground}>
                    <div className={classes.centerInfo}>
                        <h1 className={classes.title}>Hello, Friend!</h1>
                        <p className={classes.informative}>
                            Already have an account?
                        </p>
                        <button
                            type="button"
                            onClick={sendToSignIn}
                            className={classes.button}
                        >
                            SIGN IN
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(SignUp)
