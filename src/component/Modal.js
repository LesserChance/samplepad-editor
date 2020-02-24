/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { confirmFileOverwriteAction, confirmLoadCardAction } from 'actions/modal'

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

      {props.showConfirmLoadCard &&
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="message is-warning">
              <div className="message-header">
                <p>Are you sure?</p>
              </div>
              <div className="message-body">
                <div className="is-clearfix">You will lose any unsaved kit data when you load another card. Are you sure you want to do this?</div>

                <div className="field is-grouped is-pulled-right is-marginless is-padingless">
                  <div className="buttons control">
                    <button className="button" onClick={props.closeConfirmLoadCard}>Cancel</button>
                    <button className="button is-warning" onClick={props.dispatchCallbackAndCloseLoadCard}>Ok</button>
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
    showConfirmLoadCard: state.modals.confirmLoadCardVisible
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
    closeConfirmLoadCard: () => {
      dispatch(confirmLoadCardAction(false));
    },
    dispatchCallbackAndCloseLoadCard: () => {
      dispatch(confirmLoadCardAction(true));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponent)