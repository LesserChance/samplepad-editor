import React from 'react';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import { Drive } from "../util/const";
import { getGlobalStateFromDirectory, getKitPadsFromFile, saveKit } from "../util/fileParser";
import { KitModel } from "../util/models";
import AppComponent from "./App";

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

class Store extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    let initialState = getGlobalStateFromDirectory('/Volumes/SAMPLERACK');
    this.state = this.getInitialState(initialState);

    this.loadCard = this.loadCard.bind(this);
    this.loadKitFromFile = this.loadKitFromFile.bind(this);
    this.saveKit = this.saveKit.bind(this);
    this.saveNewKit = this.saveNewKit.bind(this);
    this.loadNewKit = this.loadNewKit.bind(this);
    this.loadSelectedKit = this.loadSelectedKit.bind(this);
    this.setSelectedKit = this.setSelectedKit.bind(this);
    this.updateKitProperty = this.updateKitProperty.bind(this);
    this.updatePadSample = this.updatePadSample.bind(this);
    this.updatePadIntProperty = this.updatePadIntProperty.bind(this);
    this.updatePadStringProperty = this.updatePadStringProperty.bind(this);
    this.updatePadSensitivity = this.updatePadSensitivity.bind(this);

    this.getSampleFilePath = this.getSampleFilePath.bind(this);
    this.getActiveKitProperty = this.getActiveKitProperty.bind(this);
  }

  getInitialState(initialState) {
    let activeKitId = null;
    if (Object.keys(initialState.kits).length) {
      activeKitId = Object.keys(initialState.kits)[0];
    }

    return Object.assign({
      whammy: 1,
      driveRootModelPath: null,
      driveKitPath: null,
      driveFileCount: null,
      kits: {},
      samples: [],

      selectedKitId: activeKitId,
      activeKitId: activeKitId
    }, initialState)
  }

  loadCard() {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties:["openDirectory"]
    }).then(result => {
      if (result.canceled) {
        return null;
      }

      let initialState = getGlobalStateFromDirectory(result.filePaths[0]);
      this.setState(this.getInitialState(initialState));
    }).catch(err => {
      console.log(err);
    })
  }

  loadKitFromFile() {
    return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties:["openFile"],
      filters: [
        { name: 'Kits (* .' + Drive.KIT_FILE_TYPE + ')',
          extensions: [Drive.KIT_FILE_TYPE] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(result => {
      if (result.canceled) {
        return null;
      }

      let kitPath = path.parse(result.filePaths[0]);
      let kit = KitModel(
        kitPath.dir,
        kitPath.base,
        true,
        true,
        kitPath.name,
        getKitPadsFromFile(result.filePaths[0])
      );

      this.setState(update(this.state, {
        selectedKitId: {$set: kit.id},
        activeKitId: {$set: kit.id},
        kits: {
          [kit.id]: {$set: kit}
        }
      }));
    }).catch(err => {
      console.log(err)
    })
  }

  loadNewKit() {
    let kit = KitModel(null, null, true, true);

    this.setState(update(this.state, {
      selectedKitId: {$set: kit.id},
      activeKitId: {$set: kit.id},
      kits: {
        [kit.id]: {$set: kit}
      }
    }));
  }

  loadSelectedKit() {
    let selectedKit = this.state.kits[this.state.selectedKitId];

    if (!selectedKit.isLoaded) {
      this.loadKit(this.state.selectedKitId);
    }

    this.setState({activeKitId: this.state.selectedKitId})
  }

  saveKit() {
    let kit = this.state.kits[this.state.activeKitId];
    saveKit(kit, false);

    // todo: update state so this is no longer dirty/new
  }

  saveNewKit() {
    let kit = this.state.kits[this.state.activeKitId];
    saveKit(kit, true);

    // todo: update state so this is no longer dirty/new
  }

  setSelectedKit(kitId) {
    this.setState({selectedKitId: kitId});
  }

  updateKitProperty(kitId, property, value) {
    this.setState(update(this.state, {
      kits: {
        [kitId]: {
          [property]: {$set: value}
        }
      }
    }));
  }

  updatePadSample(kitId, padId, value) {
    // todo
  }

  updatePadIntProperty(kitId, padId, property, value) {
    this.updatePadProperty(kitId, padId, property, parseInt(value, 10));
  }

  updatePadStringProperty(kitId, padId, property, value) {
    this.updatePadProperty(kitId, padId, property, value);
  }

  updatePadSensitivity(kitId, padId, value) {
    //todo: map the value
    this.updatePadProperty(kitId, padId, "sensitivity", value);
  }

  updatePadProperty(kitId, padId, property, value) {
    this.setState(update(this.state, {
      kits: {
        [kitId]: {
          pads: {
            [padId]: {
              [property]: {$set: value}
            }
          }
        }
      }
    }));
  }

  getSampleFilePath(sample_file) {
    return this.state.driveRootModelPath + "/" + sample_file;
  }

  getActiveKitProperty(property) {
    if (!this.state.activeKitId) {
      return null;
    }

    return this.state.kits[this.state.activeKitId][property];
  }

  loadKit(kitId) {
    let kit = this.state.kits[kitId];

    if (kit.isLoaded) {
      return;
    }

    let kitFile = kit.filePath + "/" + kit.fileName;
    if(fs.existsSync(kitFile)) {
      this.setState(update(this.state, {
        kits: {
          [kitId]: {
            isLoaded: {$set: true},
            kitName: {$set: path.parse(kitFile).name},
            pads: {$set: getKitPadsFromFile(kitFile)}
          }
        }
      }));
    }
  }

  render() {
    return (
      <DndProvider backend={Backend}>
        <AppComponent
          // properties
          driveRootModelPath={this.state.driveRootModelPath}
          driveKitPath={this.state.driveKitPath}
          driveFileCount={this.state.driveFileCount}
          kits={this.state.kits}

          samples={this.state.samples}
          selectedKitId={this.state.selectedKitId}
          activeKitId={this.state.activeKitId}
          activeKit={this.state.kits[this.state.activeKitId].kitName}

          // methods
          loadCard={this.loadCard}
          loadKitFromFile={this.loadKitFromFile}
          saveKit={this.saveKit}
          saveNewKit={this.saveNewKit}
          loadNewKit={this.loadNewKit}
          loadSelectedKit={this.loadSelectedKit}
          setSelectedKit={this.setSelectedKit}
          updateKitProperty={this.updateKitProperty}
          updatePadSample={this.updatePadSample}
          updatePadIntProperty={this.updatePadIntProperty}
          updatePadStringProperty={this.updatePadStringProperty}
          updatePadSensitivity={this.updatePadSensitivity}
          getSampleFilePath={this.getSampleFilePath}
          getActiveKitProperty={this.getActiveKitProperty}
        />
      </DndProvider>
    );
  }
}

export default Store;
