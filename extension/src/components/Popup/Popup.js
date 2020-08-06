import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { getProfile, login } from '../../common/api'
import CurrentTracks from './CurrentTracks'
import SignIn from './SignIn'

const styles = {
    button: {
        outline: 'none',
    },
    input: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
    },
}


class Popup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = { user: null }
    }

    componentDidMount() {
        getProfile()
            .then((user) => {
                this.setState({
                    user,
                })
            })
    }

    handleClick = () => {
        chrome.tabs.query({
            active: true,
            currentWindow: true,
        }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { toggleSelectPrice: true })
        })

        window.close()
    }

    handleLogin = (email, password) => {
        login({
            email,
            password,
        })
            .then((user) => {
                this.setState({
                    user,
                })
            })
    }

    render() {
        const { classes } = this.props
        const { user } = this.state

        return (
            <div>
                {
                    !user
                        ? <SignIn handleLogin={this.handleLogin} />
                        : (
                            <div>
                                <button
                                    className={classes.button}
                                    type="button"
                                    onClick={this.handleClick}
                                >
                                    Select price
                                </button>
                                <CurrentTracks user={user} />
                            </div>
                        )
                }
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(Popup)
