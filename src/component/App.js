import React from 'react';
import './App.css';

import KitfileParser from "../util/kitfile_parser"

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      kit: props.kit
    };

    this.loadKit = this.loadKit.bind(this);
  }

  render() {
    return (
      <div className="App">
        <button onClick = {this.loadKit}>Load Kit</button>

        {this.state.kit &&
          <div>
            <div>
              <strong>Kit:</strong>
              <div>filepath: {this.state.kit.filepath}</div>
              <div>filename: {this.state.kit.filename}</div>
              <div>kit_name: {this.state.kit.kit_name}</div>
            </div>

            <div className="mt-2">
              <strong>Pads:</strong>
              {
                this.state.kit.pads.map((pad, index) => {
                  return (
                    <div key={index}>
                      <strong>Pad:</strong>
                      <div>filename: {pad.filename}</div>
                      <div>display_name: {pad.display_name}</div>
                      <div>velocity_min: {pad.velocity_min}</div>
                      <div>velocity_max: {pad.velocity_max}</div>
                      <div>filename_b: {pad.filename_b}</div>
                      <div>display_name_b: {pad.display_name_b}</div>
                      <div>velocity_min_b: {pad.velocity_min_b}</div>
                      <div>velocity_max_b: {pad.velocity_max_b}</div>
                      <div>tune: {pad.tune}</div>
                      <div>tune_display: {pad.tune_display}</div>
                      <div>sensitivity: {pad.sensitivity}</div>
                      <div>sensitivity_display: {pad.sensitivity_display}</div>
                      <div>pan: {pad.pan}</div>
                      <div>pan_display: {pad.pan_display}</div>
                      <div>reverb: {pad.reverb}</div>
                      <div>level: {pad.level}</div>
                      <div>midi_note: {pad.midi_note}</div>
                      <div>mode: {pad.mode}</div>
                      <div>mgrp: {pad.mgrp}</div>
                    </div>
                  );
                })
              }
            </div>
          </div>}
      </div>
    );
  }

  loadKit() {
    KitfileParser
    .openKitFile()
    .then(result => {
      console.log("ouside class")
      console.log(result);
      this.setState({kit: result})
    })
  }
}

export default App;
