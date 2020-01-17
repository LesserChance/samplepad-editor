import React from 'react';
import { importKitFromFile, selectKit, loadNewKit } from '../redux/actions'
import { connect } from 'react-redux'

const KitList = (props) => {
  return (
    <section>
      <label className="label kitHeader is-size-5">Select, Import, or Create a New Kit</label>

      <div className="field is-grouped">
        <div className="select control">
          <select
            value={props.selectedKitId || ""}
            onChange={(e) => props.setSelectedKit(e.target.value)}>
            <option disabled value="">Select a Kit</option>
            {
              Object.keys(props.kits).map((kitId) => {
                let kit = props.kits[kitId]
                return (
                  <option key={kit.id} value={kit.id}>
                    { kit.isNew && "<New> " + kit.kitName }
                    { !kit.isNew && kit.originalKitName }
                  </option>
                );
              })
            }
          </select>
        </div>

        <div className="buttons control">
          <a className="button" onClick={props.loadKitFromFile}>Import Kit</a>
          <a className="button" onClick={props.loadNewKit}>New Kit</a>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    kits: state.kits,
    selectedKitId: state.app.selectedKitId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadKitFromFile: () => {
      dispatch(importKitFromFile());
    },
    loadNewKit: () => {
      dispatch(loadNewKit());
    },
    setSelectedKit: (kitId) => {
      dispatch(selectKit(kitId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KitList)
