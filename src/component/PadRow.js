import React from 'react';
import PadSampleDropTargetComponent from './PadSampleDropTarget'

class PadRowComponent extends React.Component {
  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      showLayerB: false
    };

    this.toggleLayerB = this.toggleLayerB.bind(this);
  }

  toggleLayerB(filter) {
    this.setState({showLayerB: !this.state.showLayerB})
  }

  render() {
    return <PadSampleDropTargetComponent
      padId={this.props.padId}
      showLayerB={this.state.showLayerB}
      toggleLayerB={this.toggleLayerB}
    />;
  }
}

export default PadRowComponent
