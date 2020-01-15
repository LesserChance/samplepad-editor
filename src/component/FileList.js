import React from 'react';

import '../css/FileList.css';
import samplePlayer from '../util/sample_player';

const remote = window.require('electron').remote;

class FileListComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {};

    this.playSample = this.playSample.bind(this);
  }

  render() {
    return (
      <div className="FileList">
        <nav className="panel">
          <div className="panel-heading">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  Samples
                </div>
              </div>

              <div className="level-right">
                <i className="is-size-7">({this.props.fileCount}/512)</i>
              </div>
            </div>
          </div>

          <div className="panel-block">
            <div className="control has-icons-left">
              <input className="input" type="text" placeholder="Search" />
              <span className="icon is-left">
                <i  className="glyphicon glyphicon-search" aria-hidden="true"></i>
              </span>
            </div>
          </div>

          <div className="samples">
            {this.props.samples && this.props.samples.map((file, index) => {
                return (
                  <a key={index} className="panel-block sample" onClick={(e) => this.playSample(file, index)}>
                    <span className="panel-icon">
                      <i className={"glyphicon " + ((this.state["playing_sample_" + index]) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
                    </span>
                    <span className={((this.state["playing_sample_" + index]) ? "has-text-primary" : "")}>
                      {file.name}
                    </span>
                  </a>
                );
              })
            }
          </div>
        </nav>
      </div>
    );
  }

  playSample(file, index) {
    let existing_player = this.state["player_" + index];
    if (existing_player) {
      // stop the file and remove the reference to the player
      existing_player.stop();

      let new_state = {};
      new_state["player_" + index] = null;
      new_state["playing_sample_" + index] = false;
      this.setState(new_state);
      return;
    }

    // play the sample
    let player = new samplePlayer();
    let new_state = {};
    new_state["player_" + index] = player;
    new_state["playing_sample_" + index] = true;

    this.setState(new_state);

    player
      .play(this.props.sampleDrive.getSampleFilePath(file.name))
      .then(() => {
        let new_state = {};
        new_state["player_" + index] = null;
        new_state["playing_sample_" + index] = false;
        this.setState(new_state);
      })
  }
}

export default FileListComponent;
