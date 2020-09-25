import React, { PureComponent } from 'react'
import withStyles from 'react-jss'

const styles = {
    header: {
        fontSize: 28,
        fontWeight: 500,
        fontFamily: 'Recoleta',
        marginBlockStart: '0.63em',
    },

    title: {
        fontFamily: 'Basier',
        display: 'block',
        fontSize: '1.17em',
        marginBlockStart: '1em',
        marginBlockEnd: '1em',
        marginInlineStart: '0px',
        marginInlineEnd: '0px',
        fontWeight: 'bold',
    },

    paragraph: {
        fontSize: 14,
        maxWidth: 400,
        lineHeight: 1.5,
        display: 'block',
        marginBlockStart: '1em',
        marginBlockEnd: '1em',
    },
}

class Usage extends PureComponent {
    render() {
        const { classes } = this.props
        return (
            <div>
                <div className={classes.header}>
                    Thanks for downloading! Here&apos;s how to get started:
                </div>
                <div>
                    <h2 className={classes.title}>Login</h2>
                    <div className={classes.paragraph}>
                        Click our extension and sign into your account to begin tracking
                        products
                    </div>
                </div>
                <div>
                    <div className={classes.title}>Selecting price</div>
                    <div className={classes.paragraph}>
                        Open our extension and click our &quot;Select price&quot; button and click
                        the price of the product you
                        would like to begin to track
                    </div>
                </div>
                <div>
                    <div className={classes.title}>Complete fields</div>
                    <div className={classes.paragraph}>
                        Name the product you are tracking, how long you would like to track the item for (leave blank to
                        permanently track) and what price you would like to be notified at.
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Usage)
