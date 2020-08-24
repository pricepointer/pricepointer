import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import 'font-awesome/scss/font-awesome.scss'

const styles = {
    container: {
        width: 300,
        height: 300,
        border: '3 #ffffff',
        display: 'flex',
        flexDirection: 'column',
    },
    titleCard: {
        margin: '0px 10px 10px',
        display: 'flex',
        justifyContent: 'space-between',
    },

    button: {
        outline: 'none',
        backgroundColor: '#00C6E8',
        color: '#FFFFFF',
        width: 90,
        height: 40,
        borderRadius: 5,
        border: 'none',
        fontSize: '17px',
    },

    buttonCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    inputCard: {
        display: 'flex',
        margin: '20px 0px 20px',
        justifyContent: 'space-between',
    },

    labelText: {
        fontSize: '14px',
        textDecoration: 'underline',
    },

    input: {
        width: '180px',
    },
}

class SignIn extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        handleSignup: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            password: '',
            email: '',
            showSignUp: false,
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

    sendToSignUp = () => {
        this.setState({ showSignUp: true })
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

    sendToSignIn = () => {
        this.setState({ showSignUp: false })
    }

    sendToSignUp = () => {
        this.setState({ showSignUp: true })
    }

    handleClose = () => {
        window.close()
    }

    render() {
        const {
            email, password, showSignUp, name,
        } = this.state
        const { classes } = this.props
        return (
            <div className={classes.container}>
                <div
                    style={{
                        backgroundColor: '#b8d3ff',
                        height: '50px',
                    }}
                >
                    <div className={classes.titleCard}>
                        <div />
                        <h1
                            style={{
                                color: '#1a1844',
                                textAlign: 'center',
                                fontFamily: 'recoleta',
                            }}
                        >
                            pricepointer
                        </h1>
                        <i
                            className="fa fa-times"
                            aria-hidden="true"
                            onClick={this.handleClose}
                            style={{
                                color: '#1a1844',
                                fontSize: '15px',
                                paddingTop: '15px',
                                textAlign: 'right',
                            }}
                        />
                    </div>
                </div>
                {
                    showSignUp
                        ? (

                            // Sign up page
                            <div>
                                <div style={{ margin: '40px 15px 40px' }}>
                                    <div className={classes.inputCard}>
                                        <div htmlFor="name" className={classes.labelText}>
                                            Full Name:
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={this.handleChange}
                                            className={classes.input}
                                        />
                                    </div>
                                    <div className={classes.inputCard}>
                                        <div htmlFor="email" className={classes.labelText}>

                                            E-mail:
                                        </div>
                                        <input
                                            type="text"
                                            id="email"
                                            value={email}
                                            onChange={this.handleChange}
                                            className={classes.input}
                                        />
                                    </div>
                                    <div className={classes.inputCard}>
                                        <div htmlFor="password" className={classes.labelText}>
                                            Password:
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={this.handleChange}
                                            className={classes.input}
                                        />
                                    </div>
                                </div>
                                <div className={classes.buttonCard}>
                                    <button
                                        type="button"
                                        onClick={this.validation}
                                        className={classes.button}
                                    >
                                        Sign up now!
                                    </button>
                                    <button
                                        type="button"
                                        onClick={this.sendToSignIn}
                                        className={classes.button}
                                    >
                                        Log in
                                    </button>
                                </div>
                            </div>
                        )

                        // Sign in page
                        : (
                            <div>
                                <div style={{ margin: '40px 15px 40px' }}>
                                    <div className={classes.inputCard}>
                                        <div htmlFor="email" className={classes.labelText}>
                                            E-mail
                                        </div>
                                        <input
                                            type="text"
                                            id="email"
                                            value={email}
                                            onChange={this.handleChange}
                                            className={classes.input}
                                        />
                                    </div>
                                    <div className={classes.inputCard}>
                                        <div htmlFor="password" className={classes.labelText}>
                                            Password
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={this.handleChange}
                                            className={classes.input}
                                        />
                                    </div>
                                </div>
                                <div className={classes.buttonCard}>
                                    <button
                                        type="button"
                                        onClick={this.handleLogin}
                                        className={classes.button}
                                    >
                                        Login
                                    </button>
                                    <button
                                        type="button"
                                        onClick={this.sendToSignUp}
                                        className={classes.button}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        )
                }
            </div>
        )
    }
}

export default withStyles(styles)(SignIn)
