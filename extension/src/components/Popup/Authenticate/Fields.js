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
}

function Fields(
    {
        classes, fields, values, errors, generalError, buttonLabel, onChange, onSubmit, extraButtons,
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
                    type="button"
                    onClick={onSubmit}
                    className={classes.button}
                >
                    {buttonLabel}
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
}

Fields.defaultProps = {
    errors: {},
    generalError: '',
    extraButtons: null,
}

export default withStyles(styles)(Fields)
