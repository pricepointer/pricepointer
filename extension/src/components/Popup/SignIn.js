import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { post } from '../../common/api'

const signinUrl = 'signin/'
const styles = {}

class SignIn extends PureComponent {
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
        const { email, password } = this.state
        const account = {
            password,
            email,
        }
        post(signinUrl, account)
            .then(() => {
                console.log('Success:', account)
            })
            .catch((error) => {
                console.error('Error', error)
            })
    }

    render() {
        const { email, password } = this.state
        return (
            <div>
                <form>
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
                        type="submit"
                        onClick={this.handleLogin}
                    >
                        Login
                    </button>
                </form>
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(SignIn)
