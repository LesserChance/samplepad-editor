/* Global imports */
import React from 'react';

/* App imports */
import SamplePlayerUtil from 'util/samplePlayer'
import SampleStore from 'util/sampleStore'

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
      this.state.player.stop();
      this.setState({playingSample: false});
      return;
    }

    let player = new SamplePlayerUtil();

    this.setState({
      player: player,
      playingSample: true
    });

    player
      .play(SampleStore.getFileNameOnDisk(this.props.sampleFile))
      .then(() => {
        this.setState({playingSample: false});
      })
  }
}

export default SamplePlayerComponent
