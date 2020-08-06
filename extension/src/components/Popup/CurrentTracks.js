import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { get } from '../../common/api'

const productUrl = 'products/'

const styles = {
    item: {
        width: 150,
        height: 25,
    },
}

class CurrentTracks extends PureComponent {
    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            products: [],

            // error: null,
            // isLoaded: false,
        }
    }


    componentDidMount() {
        const { user } = this.props
        get(productUrl)
            .then(
                (result) => {
                    this.setState({
                        // isLoaded: true,
                        products: result.filter(product => product.user === user.id),
                    })
                },
                () => {
                    this.setState({
                        // isLoaded: true,
                        // error,
                    })
                },
            )
    }


    render() {
        const { classes } = this.props
        const { products } = this.state

        return (
            <div>
                {
                    products.map(product => (
                        <div className={classes.item}>
                            <a href={product.website} target="_blank" rel="noopener noreferrer">
                                {product.name}
                            </a>
                        </div>
                    ))
                }
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(CurrentTracks)
