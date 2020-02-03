/* Global imports */
import React from 'react';
import { useDrag } from 'react-dnd';

/* App imports */
import { DragItemTypes } from 'const';


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

  let containerProps = {
    'className': 'sampleContainer'
  };
  if (hasSample && props.useTooltip && props.fileName.length > 12) {
    containerProps = {
      'className': 'sampleContainer has-tooltip-bottom',
      'data-tooltip': props.fileName
    };
  }

  return (
    <div {...containerProps}>
      <div ref={drag} className="dragContainer">
        <button className="link panel-block sample" onClick={(e) => {if(hasSample) {props.playSample()}}}>
          <span className="panel-icon">
            <i className={"glyphicon " + ((props.playingSample) ? "glyphicon-stop" : "glyphicon-play")} aria-hidden="true" />
          </span>
          <span className={((props.playingSample) ? "has-text-primary" : "")}>
            { hasSample &&
              <div className="sampleName" dangerouslySetInnerHTML={{ __html: displayName }} />
            }
            { !hasSample &&
              <span>&lt;Empty&gt;</span>
            }
          </span>
        </button>
      </div>

      <div className="removeSample">
        { hasSample && props.removable &&
          <button className="link has-text-link is-paddingless" onClick={props.removeSample}>
            <i className="glyphicon glyphicon-trash" aria-hidden="true" />
          </button>
        }
      </div>
    </div>
  );
}

export default SampleComponent;
