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
        marginTop: '10px',
        marginRight: '7px',
        marginLeft: '10px',
        fontFamily: 'basier',
        fontWeight: '900',
        backgroundColor: '#ffffff',
        padding: '5px 10px 0px',
        borderRadius: 3,
    },

    input: {
        width: '90%',
        margin: '5px',
        outline: 'none',
        border: 'none',
        color: '#757575',
        height: '25px',
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
            inputValue: '',
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

    productFilterOnChange = (event) => {
        console.log('change is ', event.target.value)
        this.setState({
            inputValue: event.target.value,
        })
    }

    filterProducts = () => {
        const { products, inputValue } = this.state
        return products.filter(product => (inputValue === '' || product.name.toLowerCase()
            .includes(inputValue.toLowerCase())))
    }

    renderProducts = () => {
        const filteredProducts = this.filterProducts()
        return (
            filteredProducts.map(product => (
                <ProductRow
                    key={product.id}
                    product={product}
                />
            ))
        )
    }

    render() {
        const { classes } = this.props
        const { inputValue } = this.state

        return (
            <div style={{ padding: '10px 0px 0px' }}>
                <div className={classes.title}>
                    <i className="fa fa-search" aria-hidden="true" style={{ color: '#757575' }} />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={this.productFilterOnChange}
                        className={classes.input}
                        placeholder="Search products"
                    />
                </div>
                <div className={classes.productList}>
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(CurrentTracks)
