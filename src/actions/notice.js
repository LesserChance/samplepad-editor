/* App imports */
import { Actions } from 'const';
import { NoticeModel } from 'state/models';

/** NOTICE ACTION CREATORS */
/**
 * Show a temporary notice across the header
 * @param {String} style - classname for thie notice (is-success, is-warning, is-danger, ...)
 * @param {String} text - the text to show in the notice
 */
export function showNotice(style, text) {
  return (dispatch, getState) => {
    dispatch({ type: Actions.SHOW_NOTICE, notice: NoticeModel(style, text)});
  }
}

