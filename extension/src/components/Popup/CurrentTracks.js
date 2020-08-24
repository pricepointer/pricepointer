import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'
import { get } from '../../common/api'

const productUrl = 'products/'
const TEXT_COLOR = '#515151'
const styles = {
    item: {
        display: 'flex',
        alignContent: 'flex-start',
        margin: '5px 10px 10px',
    },

    price: {
        textAlign: 'right',
        display: 'inline-block',
        color: TEXT_COLOR,
    },
    watchList: {
        justifyContent: 'center',
        alignContent: 'center',
        margin: '20px 10px 10px',
        height: '170px',
        overflowY: 'auto',
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

    handleDelete = () => {
    }

    render() {
        const { classes } = this.props
        const { products, showDelete } = this.state

        return (
            <div style={{ margin: '10px 0px 0px' }}>
                <i
                    className="fa fa-trash"
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        padding: '10px 230px 10px',
                    }}
                    onClick={this.handleShowDelete}
                />
                <div className={classes.watchList}>
                    {
                        products.map(product => (
                            <div className={classes.item} key={product.id}>
                                <a
                                    style={{
                                        flex: 1,
                                        color: TEXT_COLOR,
                                        textDecoration: 'none',
                                        fontFamily: 'basier',
                                        fontSize: '14px',
                                    }}
                                    href={product.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >

                                    {product.name}
                                </a>
                                <div className={classes.price}>
                                    {product.price}
                                    {showDelete && (
                                        <i
                                            className="fa fa-times"
                                            aria-hidden="true"
                                            style={{
                                                color: '#b60000',
                                                margin: '0px 5px',
                                            }}
                                            onClick={this.handleDelete}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

// grab all info for each item that is user id

export default withStyles(styles)(CurrentTracks)
