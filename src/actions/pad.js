/* App imports */
import { Actions, PadErrors } from 'const'

/** PAD ACTION CREATORS */
/**
 * Update an integer property of a pad, value is cast to an int
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadIntProperty(padId, property, value) {
  if (value === "") {
    // dont cast empty value, let it be empty
    return updatePadProperty(padId, property, value);
  }
  return updatePadProperty(padId, property, parseInt(value, 10));
}
/**
 * Update an integer property of a pad, value is cast to a string
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadStringProperty(padId, property, value) {
  return updatePadProperty(padId, property, '' + value);
}
/**
 * Update the sensitivity property of a pad
 * @param {String} padId
 * @param {String} value
 */
export function updatePadSensitivity(padId, value) {
  return updatePadProperty(padId, "sensitivity", value);
}
/**
 * Update an individual property of a pad
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadProperty(padId, property, value) {
  return (dispatch, getState) => {
    dispatch({ type: Actions.UPDATE_PAD_PROPERTY, padId: padId, property: property, value: value });

    dispatch(validatePad(padId));
  }
}
/**
 * Validate all pad params, update the pad state with any new errors
 * @param {String} padId
 */
export function validatePad(padId) {
  return (dispatch, getState) => {
    let state = getState();
    let pad = state.pads[padId];
    let prevErrors = pad.errors;
    let errors = [];

    if (pad.velocityMin > pad.velocityMax) {
      errors.push(PadErrors.VELOCITY_SWAPPED_A)
    }
    if (pad.velocityMin > 127 || pad.velocityMax > 127) {
      errors.push(PadErrors.VELOCITY_TOO_HIGH_A);
    }
    if (pad.velocityMinB > pad.velocityMaxB) {
      errors.push(PadErrors.VELOCITY_SWAPPED_B)
    }
    if (pad.velocityMinB > 127 || pad.velocityMaxB > 127) {
      errors.push(PadErrors.VELOCITY_TOO_HIGH_B);
    }

    if (prevErrors.length || errors.length) {
      dispatch({ type: Actions.UPDATE_PAD_PROPERTY, padId: padId, property: 'errors', value: errors });
    }
  }
}
