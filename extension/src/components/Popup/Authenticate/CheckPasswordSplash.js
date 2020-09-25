import React from 'react'
import withStyles from 'react-jss'
import peoplejumpingImageUrl from '../../../../images/peoplejumping.png'
import generalStyles from './styles'

const styles = {
    informative: generalStyles.informative,

    emailSent: {
        fontSize: '16px',
        padding: '8px',
        marginBottom: '20px',
        textAlign: 'center',
    },

    image: {
        width: 200,
        height: 'auto',
        margin: '10px 10%',
    },
}

function CheckPasswordSplash({ classes }) {
    return (
        <div>
            <div className={classes.emailSent}>An email was sent!</div>
            <div className={classes.informative}>Please check your email and change your password! </div>

            <img
                src={peoplejumpingImageUrl}
                className={classes.image}
                alt="Jumping"
                title="jumping"
            />
        </div>
    )
}

export default withStyles(styles)(CheckPasswordSplash)
