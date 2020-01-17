import React from 'react';
import { connect } from 'react-redux'
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
        highlightKeyword = {this.props.highlightKeyword}
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
      .play(this.props.sampleFilePath)
      .then(() => {
        this.setState({playingSample: false});
      })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sampleFilePath: state.drive.rootModelPath + "/" +  ownProps.fileName
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleComponent)
