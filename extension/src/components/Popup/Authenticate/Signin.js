import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import 'font-awesome/scss/font-awesome.scss'
import withStyles from 'react-jss'
import { forgotPassword } from '../../../common/api'
import CheckPasswordSplash from './CheckPasswordSplash'
import Fields from './Fields'
import { authenticationStyles } from './styles'

const styles = {
    ...authenticationStyles,
    forgotPassword: {
        color: '#666666',
        margin: '5px',
    },
}

const fields = [
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
]

const forgotPasswordFields = [
    {
        type: 'text',
        property: 'email',
        placeholder: 'Email',
    },
]

class Signin extends PureComponent {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        handleClearLoginError: PropTypes.func.isRequired,
        sendToSignUp: PropTypes.func.isRequired,
        error: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            values: { email: '' },
            errors: {},
            showForgotPassword: false,
            showSuccess: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        const { handleClearLoginError } = this.props
        handleClearLoginError()
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

    handleLogin = () => {
        const { handleLogin } = this.props
        const { values: { email, password } } = this.state
        this.setState({
            isLoading: true,
        })
        handleLogin(email, password)
            .then(() => {
                this.setState({
                    isLoading: false,
                })
            }, () => {
                this.setState({
                    isLoading: false,
                })
            })
    }

    handleShowForgotPassword = () => {
        this.setState(prevState => ({
            showForgotPassword: !prevState.showForgotPassword,
        }))
    }

    validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/
        return re.test(email)
    }

    handleChangePassword = () => {
        const { values: { email } } = this.state
        const errors = {}
        if (this.validateEmail(email)) {
            this.setState({
                showSuccess: true,
            })
        } else {
            errors.email = 'Please enter a valid email'
            this.setState({
                errors,
            })
        }
        forgotPassword({ email })
    }

    render() {
        const {
            values,
            showForgotPassword,
            showSuccess,
            isLoading,
            errors,
        } = this.state
        const {
            classes,
            sendToSignUp,
            error,
        } = this.props
        return (
            <div className={classes.separator}>
                <div className={classes.lightBackground}>
                    <h1 className={classes.title}>Sign In</h1>
                    {
                        showForgotPassword
                            ? (!showSuccess
                                ? (
                                    <Fields
                                        fields={forgotPasswordFields}
                                        values={values}
                                        errors={errors}
                                        buttonLabel="Submit"
                                        onChange={this.handleChange}
                                        onSubmit={this.handleChangePassword}
                                        isLoading={isLoading}
                                        extraButtons={(
                                            <a
                                                onClick={this.handleShowForgotPassword}
                                                role="button"
                                                tabIndex={0}
                                                className={classes.forgotPassword}
                                            >
                                                Go back
                                            </a>
                                        )}
                                    />
                                ) : <CheckPasswordSplash />
                            )
                            : (
                                <Fields
                                    fields={fields}
                                    values={values}
                                    generalError={error}
                                    buttonLabel="Sign in"
                                    onChange={this.handleChange}
                                    onSubmit={this.handleLogin}
                                    isLoading={isLoading}
                                    extraButtons={(
                                        <a
                                            className={classes.forgotPassword}
                                            onClick={this.handleShowForgotPassword}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            Forgot your password?
                                        </a>
                                    )}
                                />
                            )
                    }
                </div>
                <div className={classes.darkBackground}>
                    <div className={classes.centerInfo}>
                        <h1 className={classes.title}>Hello, Friend!</h1>
                        <p className={classes.informative}>
                            Create an account and begin tracking products now!
                        </p>
                        <button
                            type="button"
                            onClick={sendToSignUp}
                            className={classes.button}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Signin)
