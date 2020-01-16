import React from 'react';
import { DragItemTypes } from "../util/const";
import { useDrag } from 'react-dnd';

const DraggableSampleComponent = (props) => {
  const [dragProps, drag] = useDrag({
    item: { type: DragItemTypes.SAMPLE }
  });

  return (
    <div ref={drag}>
      <a href="#" className="panel-block sample" onClick={(e) => props.playSample()}>
        <span className="panel-icon">
          <i className={"glyphicon " + ((props.playingSample) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
        </span>
        <span className={((props.playingSample) ? "has-text-primary" : "")}>
          {props.fileName}
        </span>
      </a>
    </div>
  );
};

export default DraggableSampleComponent;
