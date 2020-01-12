import React from 'react';
import FileList from './FileList';
import Kit from './Kit';
import KitfileParser from "../util/kitfile_parser"

import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sd_card: props.sd_card,
      kit: props.kit
    };

    this.loadCard = this.loadCard.bind(this);
    this.loadKit = this.loadKit.bind(this);
    this.saveKit = this.saveKit.bind(this);
    this.saveNewKit = this.saveNewKit.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div>
          <button onClick = {this.loadCard}>Load SD Card</button>
          <button onClick = {this.loadKit}>Load Kit</button>
          <button onClick = {this.saveKit}>Save Kit</button>
          {!this.state.kit.is_new &&
            <button onClick = {this.saveNewKit}>Save as New Kit</button>
          }
        </div>
        <div className="row">
          <div className="col-2">
            <FileList sd_card={this.state.sd_card} />
          </div>
          <div className="col-10">
            <Kit kit={this.state.kit} />
          </div>
        </div>
      </div>
    );
  }

  loadCard() {
    KitfileParser
      .openSdCard()
      .then(result => {
        this.setState({sd_card: result})
      })
  }

  loadKit() {
    KitfileParser
      .openKitFile()
      .then(result => {
        if (result !== null) {
          this.setState({kit: result});
        }
      })
  }

  saveKit() {
    this.state.kit.save();
  }

  saveNewKit() {
    this.state.kit.save(true);
  }
}

export default App;
