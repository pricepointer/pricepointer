const common = {
    informative: {
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },

    button: {
        outline: 'none',
        backgroundColor: '#00C6E8',
        color: '#FFFFFF',
        width: 130,
        height: 35,
        borderRadius: 100,
        border: '2px solid #ffffff',
        borderColor: '#ffffff',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
    },
}

export const authenticationStyles = {
    button: common.button,
    informative: common.informative,
    lightBackground: {
        backgroundColor: '#ffffff',
        width: '50%',
        height: '100%',
    },
    darkBackground: {
        backgroundColor: '#00C6E8',
        color: '#ffffff',
        width: '50%',
        height: '100%',
        textAlign: 'center',
    },
    title: {
        textAlign: 'center',
        paddingTop: '20px',
        fontWeight: '900',
        fontFamily: 'recoleta',
    },
    centerInfo: {
        margin: '25% 0px 25%',
    },
    separator: {
        display: 'inline-flex',
        height: '100%',
    },
}


export default common
