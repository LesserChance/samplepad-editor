/* Global imports */
import React from 'react';
import { connect } from 'react-redux'
import { useDrop } from 'react-dnd';

/* App imports */
import { DragItemTypes } from 'const';
import { updatePadStringProperty } from 'actions/pad'

/* Component imports */
import PadLayerAComponent from 'component/Pad/LayerA';
import PadLayerBComponent from 'component/Pad/LayerB';

const PadSampleDropTargetComponent = (props) => {

  const [{ isOver }, drop] = useDrop({
    accept: DragItemTypes.SAMPLE,
    drop: (item) => props.updatePadSample(item),
    collect: mon => ({
      isOver: !!mon.isOver()
    }),
  })

  const [{ isOverB }, dropB] = useDrop({
    accept: DragItemTypes.SAMPLE,
    drop: (item) => props.updatePadSampleB(item),
    collect: mon => ({
      isOverB: !!mon.isOver()
    }),
  })

  return (
    <div className="Pad">
      <div className="sampleDrop" ref={drop}>
        <PadLayerAComponent
          padId={props.padId}
          showLayerB={props.showLayerB}
          toggleLayerB={props.toggleLayerB} />
        {isOver && (
          <div className="sampleDropHighlight has-background-warning"/>
        )}
      </div>
      {props.showLayerB &&
        <div className="sampleDrop" ref={dropB}>
          <PadLayerBComponent padId={props.padId} />
          {isOverB && (
            <div className="sampleDropHighlight has-background-warning"/>
          )}
        </div>
      }
    </div>
  );
};


const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePadSample: (item) => {
      dispatch(updatePadStringProperty(ownProps.padId, 'fileName', item.fileName));
    },
    updatePadSampleB: (item) => {
      dispatch(updatePadStringProperty(ownProps.padId, 'fileNameB', item.fileName));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadSampleDropTargetComponent)
