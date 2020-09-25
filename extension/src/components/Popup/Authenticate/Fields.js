import PropTypes from 'prop-types'
import React from 'react'
import withStyles from 'react-jss'
import generalStyles from './styles'

const styles = {
    button: generalStyles.button,

    buttonCard: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    inputCard: {
        textAlign: 'center',
    },

    input: {
        width: '200px',
        backgroundColor: '#f1f1f1',
        border: '1px solid white',
        height: '30px',
        padding: '0px 8px',
    },

    errorInput: {
        width: '200px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #e2302f',
        height: 30,
        padding: '0px 8px',
    },

    error: {
        color: '#e2302f',
        fontSize: 10,
        textAlign: 'left',
        margin: '0px 22px 0px',
        height: 14,
    },

    loading: {
        width: 50,
        position: 'relative',
        top: -10,
    },

    lightButton: {
        transition: 'background-color 1s ease, border 1s ease',
        outline: 'none',
        backgroundColor: '#ffffff',
        width: 130,
        height: 35,
        borderRadius: 100,
        border: '2px solid #00C6E8',
        borderColor: '#00C6E8',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
    },
}


function handleKeypress(event, onSubmit) {
    if (event.keyCode === 13 || event.which === 13) {
        onSubmit()
    }
}


function Fields(
    {
        classes, fields, values, errors, generalError, buttonLabel, onChange, onSubmit, extraButtons, isLoading,
    },
) {
    return (
        <>
            <div className={classes.inputCard}>
                {
                    fields.map(({ property, ...fieldProps }) => (
                        <div key={property}>
                            <input
                                id={property}
                                value={values[property]}
                                onChange={onChange}
                                onKeyPress={(event) => {
                                    handleKeypress(event, onSubmit)
                                }}
                                className={!errors[property] ? classes.input : classes.errorInput}
                                {...fieldProps}
                            />
                            <div className={classes.error}>
                                {!!errors[property]
                                && (
                                    <div>
                                        {errors[property]}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className={classes.error}>
                {!!generalError
                && (
                    <div>
                        {generalError}
                    </div>
                )}
            </div>
            <div className={classes.buttonCard}>
                {extraButtons}
                <button
                    type="submit"
                    onClick={onSubmit}
                    className={isLoading ? classes.lightButton : classes.button}
                    disabled={isLoading}
                >
                    {isLoading
                        ? (
                            <img
                                /* eslint-disable-next-line max-len */
                                src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/35771931234507.564a1d2403b3a.gif"
                                alt="loading"
                                className={classes.loading}
                            />
                        ) : buttonLabel}
                </button>
            </div>
        </>
    )
}

Fields.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
        property: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string,
    })).isRequired,
    values: PropTypes.shape({}).isRequired,
    errors: PropTypes.shape({}),
    generalError: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    extraButtons: PropTypes.node,
    isLoading: PropTypes.bool.isRequired,
}

Fields.defaultProps = {
    errors: {},
    generalError: '',
    extraButtons: null,
}

export default withStyles(styles)(Fields)
