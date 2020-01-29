/* App imports */
import { Actions } from 'const';
import { loadKitDetails } from 'actions/kit';

/** APP ACTION CREATORS */
/**
 * set the dropdown's selected kit and set it as currently active
 * @param {String} kitId
 */
export function selectKit(kitId) {
  return (dispatch, getState) => {
    // if the kit isnt loaded, load it before activating it
    dispatch(loadKitDetails(kitId));

    // set it as the selected and active kit
    dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kitId });
    dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kitId });
  }
}
