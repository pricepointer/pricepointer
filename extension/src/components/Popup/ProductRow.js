import PropTypes from 'prop-types'
import React from 'react'
import withStyles from 'react-jss'

const TEXT_COLOR = '#515151'

const styles = {
    container: {
        display: 'flex',
        alignItems: 'stretch',
        margin: '4px 0',
    },

    item: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 15px 10px',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        borderRadius: 3,
        transition: 'width 0.3s ease',
    },

    deleteButton: {
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        textAlign: 'center',
        fontSize: '20px',
        backgroundColor: '#b60000',
        marginLeft: -3,
    },

    price: {
        textAlign: 'right',
        color: TEXT_COLOR,
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '16px',
    },

    productName: {
        color: TEXT_COLOR,
        textDecoration: 'none',
        fontFamily: 'basier',
        fontSize: '16px',
        fontWeight: '600',
        display: 'contents',
    },

    change: {
        fontSize: '10px',
        float: 'right',
        margin: '3px 0px 0px',
    },

    priceDifference: {
        display: 'inline',
        paddingRight: 4,
    },
}

class ProductRow extends React.Component {
    static propTypes = {
        product: PropTypes.shape({
            name: PropTypes.string.isRequired,
            price: PropTypes.number,
            error: PropTypes.bool,
            currency: PropTypes.string,
            website: PropTypes.string.isRequired,
            price_difference: PropTypes.number,
            percent: PropTypes.string,
        }).isRequired,
        showDelete: PropTypes.bool.isRequired,
    }

    getPriceColor = (product) => {
        if (product.price_difference < 0) {
            return '#61cd40'
        }

        if (product.price_difference > 0) {
            return '#e2302f'
        }

        return '#929292'
    }

    renderPrice() {
        const { classes, product } = this.props
        return (
            <>
                <div className={classes.price}>
                    {product.price
                        ? `${product.currency}${product.price}`
                        : (
                            product.error ? <span>Error</span>
                                : <span>Loading</span>
                        )}
                </div>
                {
                    product.price != null
                    && (
                        <div className={classes.change}>
                            <div
                                className={classes.priceDifference}
                                style={{ color: this.getPriceColor(product) }}
                            >
                                {product.price_difference > 0 && '+'}
                                {product.price_difference < 0 && '-'}
                                {' '}
                                {product.currency}
                                {product.price_difference.replace(/[^\d,.]/, '')}
                            </div>
                            (
                            {product.percent}
                            %)
                        </div>
                    )
                }
            </>
        )
    }

    renderIcon() {
        const { product } = this.props

        if (product.price == null) return null
        return (
            <div>
                {product.price_difference > 0
                && (
                    <i
                        className="fa fa-angle-double-up fa"
                        aria-hidden="true"
                        style={{
                            color: '#e2302f',
                            fontSize: '25px',
                        }}
                    />
                )}
                {product.price_difference < 0
                && (
                    <i
                        className="fa fa-angle-double-down fa"
                        aria-hidden="true"
                        style={{
                            color: '#61cd40',
                            fontSize: '25px',
                        }}
                    />
                )}
                {product.price_difference != null && Number(product.price_difference) === 0
                && (
                    <i
                        className="fa fa-minus fa"
                        aria-hidden="true"
                        style={{
                            color: '#929292',
                            fontSize: '20px',
                        }}
                    />
                )}
            </div>
        )
    }

    render() {
        const { classes, product, showDelete } = this.props

        return (
            <div className={classes.container}>
                <div className={classes.item}>
                    <div style={{ flex: 1 }}>
                        <p className={classes.productName}>
                            {product.name}
                        </p>
                    </div>
                    <div style={{ paddingRight: 14 }}>
                        {this.renderPrice()}
                    </div>
                    {this.renderIcon()}
                </div>
                <div className={classes.deleteButton} style={{ width: showDelete ? 50 : 0 }}>
                    <i
                        className="fa fa-times fa-2x"
                        aria-hidden="true"
                        style={{
                            color: '#ffffff',
                            margin: '0px 5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            this.handleDelete(product)
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ProductRow)
