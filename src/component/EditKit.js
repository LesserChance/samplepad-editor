/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { saveKit, updateKitName } from 'redux/actions'

/* Component imports */
import PadRowComponent from 'component/Pad/Row'
import "css/EditKit.css"

const EditKit = (props) => {
  return (
    <section>
      <div className="kit">
        <div className="is-size-3">Kit: {props.originalKitName}</div>
        <div className="field is-grouped">
          <div className="control">
            <input
              type="text"
              className="input kitName"
              value={props.kitName}
              onChange={(e) => props.updateKitName(e.target.value)} />
          </div>

          <div className="buttons control">
            <button className="button is-info" onClick={props.saveKit}>Save Kit</button>
            {
              props.showSaveAsNew &&
              <button className="button" onClick={props.saveNewKit}>Save as New Kit</button>
            }
          </div>
        </div>

        <div className="pad-table">
          {
            props.pads.map((padId) => {
              return (
                <PadRowComponent padId={padId} key={padId} />
              );
            })
          }
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state, ownProps) => {
  let kit = state.kits.models[ownProps.kitId];

  return {
    showSaveAsNew: kit.isExisting,
    kitName: kit.kitName,
    originalKitName: kit.originalKitName,
    pads: kit.pads
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveKit: () => {
      dispatch(saveKit(ownProps.kitId));
    },
    saveNewKit: () => {
      dispatch(saveKit(ownProps.kitId, true));
    },
    updateKitName: (value) => {
      dispatch(updateKitName(ownProps.kitId,  value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditKit)
