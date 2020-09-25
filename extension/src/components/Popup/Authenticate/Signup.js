import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { signup } from '../../../common/api'
import ConfirmationSplash from './ConfirmationSplash'
import Fields from './Fields'
import { authenticationStyles } from './styles'

const styles = {
    ...authenticationStyles,
}

const fields = [
    {
        type: 'text',
        property: 'name',
        placeholder: 'Full name',
    },
    {
        type: 'text',
        property: 'email',
        placeholder: 'Email',
    },
    {
        type: 'password',
        property: 'password',
        placeholder: 'Password',
    },
    {
        type: 'password',
        property: 'confirmPassword',
        placeholder: 'Confirm password',
    },
]

class Signup extends PureComponent {
    static propTypes = {
        sendToSignIn: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            values: {},
            errors: {},
            showCheckEmail: false,
            isLoading: false,
        }
    }

    handleSignup = () => {
        const { values } = this.state
        this.setState({
            isLoading: true,
        })
        signup(values)
            .then(() => {
                this.setState({
                    showCheckEmail: true,
                    isLoading: false,
                })
            })
            .catch((errors) => {
                this.setState({
                    errors: {
                        email: errors.error.email,
                        name: errors.error.name,
                        password: errors.error.password,
                    },
                    showCheckEmail: false,
                    isLoading: false,
                })
            })
    }

    handleChange = (event) => {
        const { value, id: property } = event.target
        this.setState(prevState => ({
            values: {
                ...prevState.values,
                [property]: value,
            },
        }))
    }

    isValid = () => {
        const { values: { password, confirmPassword } } = this.state

        const errors = {}
        if (confirmPassword !== password) {
            errors.confirmPassword = 'Passwords do not match'
        }

        this.setState({ errors })

        return !Object.keys(errors).length
    }

    handleSubmit = () => {
        // First, do validations
        if (this.isValid()) {
            this.handleSignup()
        }
    }

    render() {
        const {
            values,
            errors,
            showCheckEmail,
            isLoading,
        } = this.state
        const {
            classes,
            sendToSignIn,
        } = this.props
        return (
            <div className={classes.separator}>
                <div className={classes.lightBackground}>
                    <h1 className={classes.title}>Sign up</h1>
                    {
                        showCheckEmail
                            ? <ConfirmationSplash />
                            : (
                                <Fields
                                    fields={fields}
                                    values={values}
                                    errors={errors}
                                    buttonLabel="Sign up"
                                    isLoading={isLoading}
                                    onChange={this.handleChange}
                                    onSubmit={this.handleSubmit}
                                />
                            )
                    }
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
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Signup)
