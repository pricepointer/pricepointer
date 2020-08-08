import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'

const styles = {}

class SignIn extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        handleSignup: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            // error: null,
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

    render() {
        const {
            email, password, showSignUp, name,
        } = this.state
        return (
            <div>
                {
                    showSignUp
                        ? (

                            // Sign up page
                            <div>
                                <label htmlFor="name">
                                    Full Name:
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={this.handleChange}
                                    />
                                </label>
                                <label htmlFor="email">
                                    E-mail:
                                    <input
                                        type="text"
                                        id="email"
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                </label>
                                <label htmlFor="password">
                                    Password:
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={this.handleChange}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={this.validation}
                                >
                                    Sign up now!
                                </button>
                                <button
                                    type="button"
                                    onClick={this.sendToSignIn}
                                >
                                    Log in
                                </button>
                            </div>
                        )

                        // Sign in page
                        : (
                            <div>
                                <label htmlFor="email">
                                    E-mail:
                                    <input
                                        type="text"
                                        id="email"
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                </label>
                                <label htmlFor="password">
                                    Password:
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={this.handleChange}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={this.handleLogin}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={this.sendToSignUp}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )
                }
            </div>
        )
    }
}

export default withStyles(styles)(SignIn)
