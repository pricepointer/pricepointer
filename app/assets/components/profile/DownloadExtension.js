import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import withStyles from 'react-jss'

const styles = {
    button: {
        position: 'relative',
        display: 'inline-block',
        margin: 0,
        padding: '8px 24px',
        fontFamily: 'Basier',
        fontSize: 16,
        lineHeight: 1.5,
        textAlign: 'center',
        textDecoration: 'none',
        color: '#f8f9fa',
        background: '#f06ba2',
        border: '1px solid #f06ba2',
        borderRadius: '5',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
    },

    header: {
        fontSize: 60,
        fontWeight: 500,
        fontFamily: 'Recoleta',
        marginBlockStart: '0.83em',
        marginBlockEnd: '0.83em',
    },

    paragraph: {
        fontSize: '1.4em',
        maxWidth: 400,
        lineHeight: 1.6,
        display: 'block',
        marginBlockStart: '1em',
        marginBlockEnd: '1em',
    },
}

class DownloadExtension extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
    }

    render() {
        const { classes, url } = this.props
        return (
            <div>
                <div className={classes.header}>Get your dealhound on.</div>
                <div className={classes.paragraph}>
                    Pricepointer notifies you when your favorite products go on sale.
                </div>
                <a href={url} className={classes.button}>
                    Add to Chrome -- it&apos;s free
                </a>
            </div>
        )
    }
}

export default withStyles(styles)(DownloadExtension)
