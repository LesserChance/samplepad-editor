/* Global imports */
import React from 'react';
import { useDrag } from 'react-dnd';

/* App imports */
import { DragItemTypes } from "util/const";


const SampleComponent = (props) => {
  let [, drag] = useDrag({
    item: { type: DragItemTypes.SAMPLE, fileName: props.fileName },
    canDrag: monitor => (props.draggable)
  });

  let hasSample = !!props.fileName;

  // highlight the search term in the sample name
  let displayName = props.fileName;
  if (hasSample && props.highlightKeyword) {
    var start=displayName.toLowerCase().indexOf(props.highlightKeyword.toLowerCase());

    displayName = displayName.substr(0,start)
      + '<span class="has-background-white-ter">'
      + displayName.substr(start, props.highlightKeyword.length)
      + '</span>'
      + displayName.substr(start + props.highlightKeyword.length)
  }

  return (
    <div ref={drag}>
      <a href="#" className="panel-block sample" onClick={(e) => {if(hasSample) {props.playSample()}}}>
        <span className="panel-icon">
          <i className={"glyphicon " + ((props.playingSample) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
        </span>
        <span className={((props.playingSample) ? "has-text-primary" : "")}>
          { hasSample &&
            <div dangerouslySetInnerHTML={{ __html: displayName }} />
          }
          { !hasSample &&
            <span>&lt;Empty&gt;</span>
          }
        </span>
      </a>
    </div>
  );
}

export default SampleComponent;
