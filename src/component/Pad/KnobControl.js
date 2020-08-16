/* Global imports */
import React from 'react';
import Slider from 'rc-slider';

/* Component imports */
import 'css/Pad/Control.css'

class KnobComponent extends React.Component {

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

  getRotateTransform(value) {
    // rotation goes from -90 to 90
    let range = this.props.max - this.props.min
    let step = 180/range;
    let rotation = -90 + (step*(value - this.props.min))
    let rotate = 'rotate(' + (rotation) + 'deg)';
    return rotate;
  }

  getHandle(handleProps) {
    const { value, ...restProps } = handleProps;

    return (
      <span className="knobIcon">
        <i
          style={{transform: this.getRotateTransform(restProps.dragging ? value : this.props.value)}}
          className={"glyphicon glyphicon-" + this.props.icon}
          aria-hidden="true"
        />
      </span>
    );
  }

  render() {
    return (
      <span className="controlContainer has-tooltip-bottom"
        data-tooltip={this.props.tooltip + this.props.value} >
        <span className={'height-' + (this.props.stepDistance)}>
          <div className="value">{ this.state.value }</div>
          <Slider
            min={this.props.min}
            max={this.props.max}
            defaultValue={this.props.value}
            vertical={true}
            handle={this.getHandle.bind(this)}
            onChange={this.onSliderChange.bind(this)}
            onAfterChange={(value) => this.props.onChange(value)} />
        </span>
      </span>
    );
  }
}

export default KnobComponent;
