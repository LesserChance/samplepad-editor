/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { confirmFileOverwriteAction } from 'redux/actions'

const ModalComponent = (props) => {
  return (
    <div className="Modals">
      {props.showConfirmOverwrite &&
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="message is-warning">
              <div className="message-header">
                <p>Are you sure?</p>
              </div>
              <div className="message-body">
                <div className="is-clearfix">Saving the kit with this name will overwrite an existing kit. Are you sure you want to do this?</div>

                <div className="field is-grouped is-pulled-right is-marginless is-padingless">
                  <div className="buttons control">
                    <button className="button" onClick={props.closeConfirmOverwrite}>Cancel</button>
                    <button className="button is-warning" onClick={props.dispatchCallbackAndCloseConfirmOverwrite}>Ok</button>
                  </div>
                </div>
                <div className="is-clearfix" />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    showConfirmOverwrite: state.modals.confirmOverwriteVisible
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeConfirmOverwrite: () => {
      dispatch(confirmFileOverwriteAction(false));
    },
    dispatchCallbackAndCloseConfirmOverwrite: () => {
      dispatch(confirmFileOverwriteAction(true));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent)