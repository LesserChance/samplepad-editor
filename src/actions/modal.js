/* App imports */
import { Actions } from 'const';

/** MODAL ACTION CREATORS */
/**
 * @param {Function} callback - function to cann when the modal is closed
 */
export function confirmFileOverwrite(callback) {
  return (dispatch, getState) => {
    dispatch({ type: Actions.SHOW_MODAL_CONFIRM_OVERWRITE, callback: callback });
  }
}
/**
 * hide the confirm overwrite modal and call the callback
 * @param {Boolean} result - true if the user chose to overwrite
 */
export function confirmFileOverwriteAction(result) {
  return (dispatch, getState) => {
    let state = getState();
    let callback = state.modals.confirmOverwriteCallback;

    dispatch({ type: Actions.HIDE_MODAL_CONFIRM_OVERWRITE });
    dispatch(callback(result));
  }
}
