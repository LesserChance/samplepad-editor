/* Global imports */
import React from 'react';

/* App imports */
import SampleStore from 'util/sampleStore'

/* Electron imports */
const { playWavFile, stopWavFile } = window.api;

class SamplePlayerComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      playingSample: false
    };

    this.renderChildren = this.renderChildren.bind(this)
    this.playSample = this.playSample.bind(this);
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        playSample: this.playSample,
        playingSample: this.state.playingSample
      })
    })
  }

  render() {
    return (
      <div>
        {this.renderChildren()}
      </div>
    );
  }

  playSample() {
    if (this.state.playingSample) {
      stopWavFile();
      this.setState({playingSample: false});
      return;
    }

    this.setState({
      playingSample: true
    });

    playWavFile(SampleStore.getFileNameOnDisk(this.props.sampleFile))
      .then(() => {
        this.setState({playingSample: false});
      })
  }
}

export default SamplePlayerComponent
