import PropTypes from 'prop-types'
import React from 'react'
import withStyles from 'react-jss'
import { changePassword } from '../../../../extension/src/common/api'


const styles = {
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

    error: {
        color: '#e2302f',
        fontSize: '10px',
        textAlign: 'left',
        margin: '0px 22px 0px',
        height: '14px',
    },
}

class Reset extends React.Component {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
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

    handlePasswordCheck = () => {
        const { password, confirmPassword } = this.state
        this.setState({
            noMatchError: false,
        })
        if (confirmPassword !== password) {
            this.setState({
                noMatchError: true,
            })
        }
    }

    changePassword = () => {
        const { password } = this.state
        const { confirmationCode } = this.props

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

    render() {
        const {
            password, confirmPassword, noMatchError, success, failed,
        } = this.state
        const { classes } = this.props
        return (
            <div>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={this.handleChange}
                    className={classes.input}
                    placeholder="Password"
                />
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={this.handleChange}
                    className={noMatchError ? classes.errorInput : classes.input}
                    placeholder="Confirm password"
                />
                <div className={classes.error}>
                    {!!noMatchError
                    && (
                        <div>
                            Passwords do not match!
                        </div>
                    )}
                </div>
                <button type="button" onClick={this.handlePasswordCheck}> CHANGE PASSWORD</button>
                {success && (<div> Password change was successful</div>)}
                {failed && (<div> Password change failed</div>)}
            </div>
        )
    }
}

export default withStyles(styles)(Reset)
