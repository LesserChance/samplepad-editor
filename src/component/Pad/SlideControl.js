/* Global imports */
import React from 'react';
import Slider from 'rc-slider';

/* Component imports */
import 'css/Pad/Control.css'

class SlideComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    };
  }

  onSliderChange(value) {
    this.setState({
      value,
    });
  };

  getWidth(value) {
    let range = this.props.max - this.props.min;
    let step = 1.2/range;

    return (value * step) + 'em';
  }

  getColor(value) {
    let range = this.props.max - this.props.min
    let step = 255/range;
    let color = Math.floor((255 - (value * step))).toString(16);
    return '#' + color + color + color;
  }

  getHandle(handleProps) {
    const { value, ...restProps } = handleProps;

    let newStyle = {};
    if (this.props.overlayProperty === 'width') {
      newStyle.width = this.getWidth(restProps.dragging ? value : this.props.value);
    }
    if (this.props.overlayProperty === 'color') {
      newStyle.color = this.getColor(restProps.dragging ? value : this.props.value);
    }

    return (
      <div className="overlapHandle">
        <i
          className={"glyphicon glyphicon-" + this.props.icon + " overlapValue"}
          style={newStyle}
          aria-hidden="true" />
      </div>
    );
  }

  render() {
    return (
      <span className="controlContainer has-tooltip-bottom" data-tooltip={this.props.tooltip + this.props.value} >
        <div><i className={"glyphicon glyphicon-" + this.props.icon + " has-text-grey-lighter"} aria-hidden="true" /></div>
        <div className="value">{ this.state.value }</div>
        <span className={'overlapContainer height-' + (this.props.stepDistance)}>
          <Slider
            min={this.props.min}
            max={this.props.max}
            defaultValye={this.props.value}
            vertical={true}
            handle={this.getHandle.bind(this)}
            onChange={this.onSliderChange.bind(this)}
            onAfterChange={(value) => this.props.onChange(value)} />
        </span>
      </span>
    );
  }
}

export default SlideComponent;
