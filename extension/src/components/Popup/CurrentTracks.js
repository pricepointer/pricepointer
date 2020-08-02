import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { get } from '../../common/api'

const user = 1
const productUrl = 'products/'

const styles = {
    item: {
        width: 150,
        height: 25,
    },
}

class CurrentTracks extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            products: [],

            // error: null,
            // isLoaded: false,
        }
    }


    componentDidMount() {
        get(productUrl)
            .then(
                (result) => {
                    this.setState({
                        // isLoaded: true,
                        products: result.filter(product => product.user === user),
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
