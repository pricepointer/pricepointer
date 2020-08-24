import PropTypes from 'prop-types'
import React from 'react'
import withStyles from 'react-jss'
import pricepointerImageUrl from '../../images/pricepointer.png'


const styles = {
    titleCard: {
        padding: '15px 10px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#b8d3ff',
        height: 50,
        boxSizing: 'border-box',
    },

    iconButton: {
        cursor: 'pointer',
        color: '#1a1844',
        fontSize: '15px',
    },

    logo: {
        width: 100,
        height: 20.64,
    },
}

const Header = ({
    classes,
    handleClose,
    icon = null,
    iconHandler = null,
    iconTitle = null,
    isContent = false,
}) => (
    <div className={classes.titleCard}>
        <div>
            {
                !!icon
                && (
                    <a
                        role="button"
                        onClick={iconHandler}
                        title={iconTitle}
                        alt={iconTitle}
                        tabIndex={-1}
                    >
                        <i
                            aria-hidden="true"
                            className={`${classes.iconButton} fa fa-${icon}`}
                        />
                    </a>
                )
            }
        </div>
        <img
            src={
                isContent
                    ? chrome.extension.getURL(pricepointerImageUrl)
                    : pricepointerImageUrl}
            className={classes.logo}
            alt="Pricepointer"
            title="Pricepointer"
        />
        <i
            aria-hidden="true"
            onClick={handleClose}
            className={`${classes.iconButton} fa fa-times`}
        />
    </div>
)


Header.propTypes = {
    classes: PropTypes.shape().isRequired,
    handleClose: PropTypes.func.isRequired,
    isContent: PropTypes.bool,

    icon: PropTypes.string,
    iconTitle: PropTypes.string,
    iconHandler: PropTypes.func,
}

Header.defaultProps = {
    isContent: false,
    icon: null,
    iconTitle: null,
    iconHandler: null,
}

export default withStyles(styles)(Header)
