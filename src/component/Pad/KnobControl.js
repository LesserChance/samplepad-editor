/* Global imports */
import React from 'react';
import Slider from 'rc-slider';

/* Component imports */
import "css/Pad/Control.css"

const KnobComponent = (props) => {

  let min = props.min;
  let max = props.max;

  const getRotateTransform = (value) => {
    // rotation goes from -90 to 90
    let range = max - min
    let step = 180/range;
    let rotation = -90 + (step*(value - min))
    let rotate = 'rotate(' + (rotation) + 'deg)';
    return rotate;
  }

  const getHandle = (handleProps) => {
    const { value, ...restProps } = handleProps;

    return (
      <span className="knobIcon">
        <i
          style={{transform: getRotateTransform(restProps.dragging ? value : props.value)}}
          className={"glyphicon glyphicon-" + props.icon}
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span className="controlContainer has-tooltip-bottom"
      data-tooltip={props.tooltip + props.value} >
      <span className={'height-' + (props.stepDistance)}>
        <Slider
          min={min}
          max={max}
          defaultValye={props.value}
          vertical={true}
          handle={getHandle}
          onAfterChange={(value) => props.onChange(value)} />
      </span>
    </span>
  );
}

export default KnobComponent;
