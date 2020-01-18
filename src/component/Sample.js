import React from 'react';
import { DragItemTypes } from "../util/const";
import { useDrag } from 'react-dnd';

const SampleComponent = (props) => {
  let [, drag] = useDrag({
    item: { type: DragItemTypes.SAMPLE, fileName: props.fileName },
    canDrag: monitor => (props.draggable)
  });

  // highlight the search term in the sample name
  let displayName = props.fileName;
  if (props.highlightKeyword) {
    var start=displayName.toLowerCase().indexOf(props.highlightKeyword.toLowerCase());

    displayName = displayName.substr(0,start)
      + '<span class="has-background-white-ter">'
      + displayName.substr(start, props.highlightKeyword.length)
      + '</span>'
      + displayName.substr(start + props.highlightKeyword.length)
  }

  return (
    <div ref={drag}>
      <a href="#" className="panel-block sample" onClick={(e) => props.playSample()}>
        <span className="panel-icon">
          <i className={"glyphicon " + ((props.playingSample) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
        </span>
        <span className={((props.playingSample) ? "has-text-primary" : "")}>
          <div dangerouslySetInnerHTML={{ __html: displayName }} />
        </span>
      </a>
    </div>
  );
}

export default SampleComponent;
