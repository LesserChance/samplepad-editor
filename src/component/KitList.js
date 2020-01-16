import React from 'react';

const KitListComponent = React.memo(function KitListComponent(props) {
  return (
    <section>
      <h5 className="is-size-4">Kit</h5>
      <div>
        <a className="button is-small" onClick={props.loadKitFromFile}>Import Kit</a>
        <a className="button is-small" onClick={props.loadNewKit}>New Kit</a>
      </div>

      <h5>Kits</h5>
      <div className="KitList">
        <div className="select">
          <select
            value={props.selectedKitId}
            onChange={(e) => props.setSelectedKit(e.target.value)}>
            {
              Object.keys(props.kits).map((kitId) => {
                let kit = props.kits[kitId]
                return (
                  <option key={kit.id} value={kit.id}>
                    { kit.isNew && "<New> " }
                    { kit.kitName }
                  </option>
                );
              })
            }
          </select>
        </div>
        <a className="button" onClick={props.loadSelectedKit}>Edit Kit</a>
        <a className="button" onClick = {props.saveKit}>Save Kit</a>
        {
          props.showSaveAsNew &&
          <a className="button" onClick = {props.saveNewKit}>Save as New Kit</a>
        }
      </div>
    </section>
  );
})

export default KitListComponent;
