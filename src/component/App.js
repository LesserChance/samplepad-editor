import React from 'react';

import KitListComponent from './KitList';
import FileListComponent from './FileList';
import KitComponent from './Kit';

import Kit from '../model/kit';
import SampleDrive from '../model/sample_drive';

import '../css/App.css';

class AppComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      kit: props.kit,
      sampleDrive: props.sampleDrive,
      selectedKit: ""
    };

    this.loadCard = this.loadCard.bind(this);
    this.loadKitFromFile = this.loadKitFromFile.bind(this);
    this.saveKit = this.saveKit.bind(this);
    this.saveNewKit = this.saveNewKit.bind(this);
    this.loadNewKit = this.loadNewKit.bind(this);
    this.loadSelectedKit = this.loadSelectedKit.bind(this);

    this.setSelectedKit = this.setSelectedKit.bind(this);

    this.updateKitProperty = this.updateKitProperty.bind(this);
  }

  render() {
    return (
      <div className="App">

        <section className="hero is-small is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title">
                      SamplePad Kit Editor
                    </h1>
                  </div>
                </div>

                <div className="level-right">
                  <p className="level-item">
                    <a className="button is-link is-outlined" onClick = {this.loadCard}>Load SD Card</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="columns">
          <div className="column is-one-quarter">
            <FileListComponent samples={this.state.sampleDrive.samples} />
          </div>

          <div className="column is-three-quarters">
            <h5 className="is-size-4">Kit</h5>
            <div>
              <a className="button" onClick = {this.loadKitFromFile}>Import Kit</a>
              <a className="button" onClick = {this.saveKit}>Save Kit</a>
              {this.state.kit && !this.state.kit.isNew &&
                <a className="button" onClick = {this.saveNewKit}>Save as New Kit</a>
              }
            </div>

            <h5>Kits</h5>
            <KitListComponent
              selectedKit={this.state.selectedKit}
              kits={this.state.sampleDrive.kits}
              onChangeKit={this.setSelectedKit}
              onNewKit={this.loadNewKit}
              onLoadKit={this.loadSelectedKit} />

            {this.state.kit &&
              <KitComponent
                kitId={this.state.kit.id}
                kitName={this.state.kit.kitName}
                kitPads={this.state.kit.pads}
                updateKitProperty={this.updateKitProperty}
                />
            }
          </div>
        </section>
      </div>
    );
  }

  /*
   * set the displayed kit, and refresh all its properties
   */
  setKitState(kit) {
    this.setState({kit: kit});
  }
  setSampleDriveState(sampleDrive) {
    this.setState({sampleDrive: sampleDrive});
  }

  /*
   * @param {String} property
   * @param {String|Number} value
   */
  updateKitProperty(property, value) {
    let kit = this.state.kit
    kit[property] = value;

    this.setKitState(kit);
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
    let newKit = Kit.getEmptyKit();
    let sampleDrive = this.state.sampleDrive
    sampleDrive.kits.unshift(newKit);

    this.setState({
      "kit": newKit,
      "sampleDrive": sampleDrive,
      "selectedKit": newKit.id
    })
  }

  /*
   * select a specific kit in the dropdown
   * @param {String} kitId
   */
  setSelectedKit(kitId) {
    this.setState({"selectedKit": kitId})
  }

  /*
   * given a kit id, generate the model and load it
   * @param {String} kitId
   */
  loadSelectedKit(kitId) {
    let kit = this.state.sampleDrive.getKitById(kitId);

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
          // todo: also need to load this into the kit list
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
