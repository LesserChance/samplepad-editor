import React from 'react';
import SamplePlayer from '../util/samplePlayer';
import DraggableSampleComponent from './DraggableSample';

class SampleComponent extends React.Component {

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

    this.playSample = this.playSample.bind(this);
  }

  render() {
    return (
      <DraggableSampleComponent
        playSample = {this.playSample}
        playingSample = {this.state.playingSample}
        fileName = {this.props.fileName}
      />
    );
  }

  playSample(file) {
    if (this.state.playing_sample) {
      this.state.player.stop();
      this.setState({playingSample: false});
      return;
    }

    let player = new SamplePlayer();

    this.setState({
      player: player,
      playingSample: true
    });

    player
      .play(this.props.getSampleFilePath(this.props.fileName))
      .then(() => {
        this.setState({playingSample: false});
      })
  }
}

export default SampleComponent;
