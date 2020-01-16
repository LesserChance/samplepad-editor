import React from 'react';
import EditKitComponent from './EditKit'
import HeaderComponent from './Header'
import SampleListComponent from './SampleList'
import KitListComponent from './KitList'

const AppComponent = React.memo(function AppComponent(props) {
  return (
    <div className="App">
      <HeaderComponent
        loadCard={props.loadCard} />

      <section className="columns">
        <div className="column is-one-quarter">
          <SampleListComponent
            getSampleFilePath={props.getSampleFilePath}
            driveFileCount={props.driveFileCount}
            samples={props.samples} />
        </div>

        <div className="column is-three-quarters">
          <KitListComponent
            loadKitFromFile={props.loadKitFromFile}
            loadNewKit={props.loadNewKit}
            setSelectedKit={props.setSelectedKit}
            loadSelectedKit={props.loadSelectedKit}
            saveKit={props.saveKit}
            kits={props.kits}
            showSaveAsNew={props.kits[props.activeKitId] &&props.kits[props.activeKitId].isExisting}
            selectedKitId={props.selectedKitId} />

          {props.kits[props.activeKitId] &&
            <EditKitComponent
              kitId={props.kits[props.activeKitId].id}
              kitName={props.kits[props.activeKitId].kitName}
              kitPads={props.kits[props.activeKitId].pads}
              getSampleFilePath={props.getSampleFilePath}
              updateKitProperty={props.updateKitProperty}
              updatePadSample={props.updatePadSample}
              updatePadIntProperty={props.updatePadIntProperty}
              updatePadStringProperty={props.updatePadStringProperty}
              updatePadSensitivity={props.updatePadSensitivity}
            />
          }
        </div>
      </section>
    </div>
  );
});

export default AppComponent;
