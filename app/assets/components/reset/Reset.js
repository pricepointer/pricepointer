import PropTypes from 'prop-types'
import React from 'react'
import { changePassword } from '../../../../extension/src/common/api'

class Reset extends React.Component {
    static propTypes = {
        confirmationCode: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            password: '',
            confirmPassword: '',
            noMatchError: false,
            success: false,
            failed: false,
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    isPasswordValid = () => {
        const { password, confirmPassword } = this.state
        return password === confirmPassword
    }

    changePassword = () => {
        const { password } = this.state
        const { confirmationCode } = this.props

        const isPasswordValid = this.isPasswordValid()
        this.setState({
            noMatchError: !isPasswordValid,
        })
        if (isPasswordValid) {
            changePassword({
                password,
                confirmationCode,
            })
                .then(() => {
                    this.setState({
                        success: true,
                    })
                }, () => {
                    this.setState({
                        failed: true,
                    })
                })
        }
    }

    render() {
        const {
            password, confirmPassword, noMatchError, success, failed,
        } = this.state
        return (
            <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
                <label>New password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={this.handleChange}
                />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
                <label>Confirm password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={this.handleChange}
                    className={noMatchError ? 'error' : null}
                />
                <div>
                    {!!noMatchError
                    && (
                        <div className="error-message">
                            Passwords do not match!
                        </div>
                    )}
                </div>
                <div className="signup-box-button">
                    <button
                        type="button"
                        className="button button-secondary button-shadow button-block"
                        onClick={this.changePassword}
                    >
                        Change password
                    </button>
                </div>
                {success && (<div> Password change was successful</div>)}
                {failed && (<div> Password change failed</div>)}
            </div>
        )
    }
}

export default (Reset)
