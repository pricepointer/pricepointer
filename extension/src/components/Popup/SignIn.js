import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'

const styles = {}

class SignIn extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            // error: null,
            password: '',
            email: '',
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

    render() {
        const { email, password } = this.state
        return (
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
                        type="text"
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
            </div>
        )
    }
}

export default withStyles(styles)(SignIn)
