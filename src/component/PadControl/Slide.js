import React from 'react';
import Slider from 'rc-slider';
import "../../css/PadControl/Slider.css"

const SlideComponent = (props) => {

  let min = props.min;
  let max = props.max;

  const getWidth = (value) => {
    let range = max - min
    let step = 1.2/range;

    return (value * step) + 'em';
  }

  const getColor = (value) => {
    let range = max - min
    let step = 200/range;

    let color = (200 - (value * step)).toString(16);
    return '#' + color + color + color;
  }

  const getHandle = (handleProps) => {
    const { value, ...restProps } = handleProps;

    let newStyle = {};
    if (props.overlayProperty === 'width') {
      newStyle.width = getWidth(restProps.dragging ? value : props.value);
    }
    if (props.overlayProperty === 'color') {
      newStyle.color = getColor(restProps.dragging ? value : props.value);
    }

    return (
      <div className="overlapHandle">
        <i
          className={"glyphicon glyphicon-" + props.icon + " overlapValue"}
          style={newStyle}
          aria-hidden="true" />
      </div>
    );
  }

  return (
    <span className="knobContainer has-tooltip-bottom" data-tooltip={props.tooltip + props.value} >
      <div><i className={"glyphicon glyphicon-" + props.icon + " has-text-grey-lighter"} aria-hidden="true" /></div>
      <span className={'overlapContainer height-' + (props.stepDistance)}>
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

export default SlideComponent;
