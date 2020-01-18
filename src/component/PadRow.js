import React from 'react';
import { connect } from 'react-redux'
import PadComponent from './Pad';
import { DragItemTypes } from "../util/const";
import { useDrop } from 'react-dnd';
import { updatePadSample } from '../redux/actions'

const PadRowComponent = (props) => {

  const [{ isOver }, drop] = useDrop({
    accept: DragItemTypes.SAMPLE,
    drop: (item) => props.updatePadSample(item),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  })

  return (
    <div
      className="sampleDrop"
      ref={drop} >
      <PadComponent padId={props.padId}/>
      {isOver && (
        <div className="sampleDropHighlight has-background-warning"/>
      )}
    </div>
  );
};


const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePadSample: (item) => {
      dispatch(updatePadSample(ownProps.padId, item.fileName));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadRowComponent)