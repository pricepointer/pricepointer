import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { get, post } from '../../common/api'

const userUrl = 'user/'

const styles = {}

class SignUp extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            exists: false,

            // error: null,
            name: '',
            password: '',
            email: '',
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    validation = () => {
        const
            {
                name, password, email, exists,
            } = this.state
        this.validationCheck(email)
        if (exists) {
            alert('This e-mail is already signed up! Try logging in!')
        } else {
            this.createUser(name, password, email)
        }
    }

    createUser = (name, password, email) => {
        const data = {
            name,
            password,
            email,
        }

        post(userUrl)
            .then(() => {
                console.log('Success:', data)
            })
            .catch((error) => {
                console.error('Error', error)
            })
    }

    validationCheck = (email) => {
        get(userUrl)
            .then(
                (result) => {
                    if (result.includes(user => user.email === email)) {
                        this.setState({
                            exists: true,
                        })
                    } else {
                        this.setState({
                            exists: false,
                        })
                    }
                },
                () => {
                    // this.setState({
                    //     error,
                    // })
                },
            )
    }

    render() {
        const { name, email, password } = this.state
        return (
            <div>
                <form>
                    <label htmlFor="name">
                        Name:
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
                            type="text"
                            id="password"
                            value={password}
                            onChange={this.handleChange}
                        />
                    </label>
                    <button
                        type="submit"
                        onClick={this.validation}
                    >
                        Sign up now!
                    </button>
                </form>
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(SignUp)
