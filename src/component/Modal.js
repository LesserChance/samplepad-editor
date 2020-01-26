/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { confirmFileOverwriteAction, closeFixKitErrors } from 'redux/actions'

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

      {props.showFixKitErrors &&
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="message is-danger">
              <div className="message-header">
                <p>Cannot Save</p>
              </div>
              <div className="message-body">
                <div className="is-clearfix">Please correct all errors before saving the kit.</div>

                <div className="field is-grouped is-pulled-right is-marginless is-padingless">
                  <div className="buttons control">
                    <button className="button" onClick={props.closeFixKitErrors}>Ok</button>
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
    showConfirmOverwrite: state.modals.confirmOverwriteVisible,
    showFixKitErrors: state.modals.fixKitErrorsVisible
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
    closeFixKitErrors: () => {
      dispatch(closeFixKitErrors());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent)