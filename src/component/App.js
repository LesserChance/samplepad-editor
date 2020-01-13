import React from 'react';

import KitListComponent from './KitList';
import FileListComponent from './FileList';
import KitComponent from './Kit';

import Kit from '../model/kit';
import SampleDrive from '../model/sample_drive';

import { subscribe } from 'react-axiom';

class AppComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      sampleDrive: props.sampleDrive,
      kit: props.kit,
      sampleDrive: props.sampleDrive
    };

    this.loadCard = this.loadCard.bind(this);
    this.loadKitFromFile = this.loadKitFromFile.bind(this);
    this.saveKit = this.saveKit.bind(this);
    this.saveNewKit = this.saveNewKit.bind(this);
    this.loadNewKit = this.loadNewKit.bind(this);
    this.selectKit = this.selectKit.bind(this);

    // pulled from other components
    this.updateKitProperty = this.updateKitProperty.bind(this);
  }

  /*
   * set the displayed kit, and refresh all ints properties
   */
  setKitState(kit) {
    this.setState({kit: kit});
  }
  setSampleDriveState(sampleDrive) {
    this.setState({sampleDrive: sampleDrive});
  }

  // pulled from other components
  updateKitProperty(property, value) {
    this.state.kit[property] = value;
    this.setKitState(this.state.kit);
  }

  render() {
    return (
      <div className="App">
        <div>
          <button onClick = {this.loadCard}>Load SD Card</button>
          <button onClick = {this.loadKitFromFile}>Load Kit</button>
          <button onClick = {this.saveKit}>Save Kit</button>
          {this.state.kit && !this.state.kit.isNew &&
            <button onClick = {this.saveNewKit}>Save as New Kit</button>
          }
        </div>
        <div className="row">
          <div className="col-2">
            <FileListComponent samples={this.state.sampleDrive.samples} />
          </div>
          <div className="col-10">
            Kits:
            <KitListComponent
              kits={this.state.sampleDrive.kits}
              onNewKit={this.loadNewKit}
              onLoadKit={this.selectKit} />

            <KitComponent
              kitId={this.state.kit && this.state.kit.id}
              kitName={this.state.kit && this.state.kit.kitName}
              kitPads={this.state.kit && this.state.kit.pads}
              updateKitProperty={this.updateKitProperty}
              />
          </div>
        </div>
      </div>
    );
  }

  /*
   * Open a dialog to locate the SD card
   */
  loadCard() {
    SampleDrive.openDirectory()
      .then(result => {
        this.setSampleDriveState(result)
      })
  }

  /*
   * Create an empty kit and load it
   */
  loadNewKit() {
    let new_kit = Kit.getEmptyKit();
    let kits = this.state.sampleDrive.kits
    kits.unshift(new_kit);
    this.state.sampleDrive.kits = kits;

    this.setKitState(new_kit);
  }

  /*
   * given a kit id, generate the model and load it
   * @param {String} kit_file
   */
  selectKit(kit_id) {
    let kit = this.state.sampleDrive.getKitById(kit_id);

    if (!kit.isLoaded) {
      kit.load()
    }
    this.setKitState(kit);
  }

  /*
   * Open a dialog to locate a kit file and load it
   */
  loadKitFromFile() {
    Kit.openKitFile()
      .then(result => {
        if (result !== null) {
          this.setKitState(result);
        }
      })
  }

  /*
   *
   */
  saveKit() {
    this.state.kit.save();
  }

  /*
   *
   */
  saveNewKit() {
    this.state.kit.save(true);
  }
}

export default AppComponent;
