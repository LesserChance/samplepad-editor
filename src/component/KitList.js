/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { selectKit } from 'actions/app'
import { importKitFromFile, loadNewKit } from 'actions/kit'

const KitList = (props) => {
  return (
    <div>
      <div className="field is-grouped">
        <div className="select control">
          <select
            value={props.selectedKitId || ""}
            onChange={(e) => props.setSelectedKit(e.target.value)}>
            <option disabled value="">Select a Kit</option>
            {
              props.sortedKitIds.map((kitId) => {
                let kit = props.kits[kitId];

                return (
                  <option key={kit.id} value={kit.id}>
                    {kit.isNew && "<New> " + kit.kitName}
                    {!kit.isNew && kit.originalKitName}
                  </option>
                );
              })
            }
          </select>
        </div>

        <div className="buttons control">
          <button className="button" onClick={props.loadKitFromFile}>Import Kit</button>
          <button className="button" onClick={props.loadNewKit}>New Kit</button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    kits: state.kits.models,
    sortedKitIds: state.kits.ids,
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
