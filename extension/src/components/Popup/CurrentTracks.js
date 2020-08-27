import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { del, get } from '../../common/api'
import 'font-awesome/scss/font-awesome.scss'
import ProductRow from './ProductRow'

const productsUrl = 'products/'
const styles = {

    productList: {
        justifyContent: 'center',
        alignContent: 'center',
        padding: '0px 10px 10px',
        height: '250px',
        overflowY: 'auto',
        borderTop: '2px solid #f1f1f1',
        backgroundColor: '#f1f1f1',
    },

    container: {
        display: 'flex',
    },

    title: {
        fontSize: '16px',
        textAlign: 'center',
        margin: '10px 7px 0px',
        fontFamily: 'basier',
        fontWeight: '900',
        backgroundColor: '#ffffff',
        padding: '20px 10px 10px',
        borderRadius: 3,
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
            showDelete: false,
        }
    }

    componentDidMount() {
        this.retrieveProductList()
        this.pollProductsWithoutPrices()
    }

    handleShowDelete = () => {
        const { showDelete } = this.state
        if (showDelete === true) {
            this.setState({
                showDelete: false,
            })
        } else {
            this.setState({
                showDelete: !showDelete,
            })
        }
    }

    handleDelete = (product) => {
        del(`${productsUrl}${product.id}/`)
            .then(() => {
                console.log('Success')
            })
            .catch((error) => {
                console.error('Error', error)
            })

        this.retrieveProductList()
    }

    retrieveProductList = () => {
        get(productsUrl)
            .then(
                (result) => {
                    this.setState({
                        products: result,
                    })
                },
                () => {
                    this.setState({})
                },
            )
    }


    pollProductsWithoutPrices = () => {
        const { products } = this.state
        const update = setInterval(() => {
            if (products.every(product => !!product.price)) {
                clearInterval(update)
            }
            this.retrieveProductList()
        }, 1000)
    }


    render() {
        const { classes } = this.props
        const { products, showDelete } = this.state

        return (
            <div style={{ padding: '10px 0px 0px' }}>

                <div className={classes.title}>
                    Current Products

                    <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        style={{
                            cursor: 'pointer',
                            float: 'right',
                        }}
                        onClick={this.handleShowDelete}
                    />
                </div>
                <div className={classes.productList}>
                    {
                        products.map(product => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                showDelete={showDelete}
                            />

                        ))
                    }
                </div>
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(CurrentTracks)
