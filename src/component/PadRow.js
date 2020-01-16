import React from 'react';
import PadComponent from './Pad';
import { DragItemTypes } from "../util/const";
import { useDrop } from 'react-dnd';

const PadRowComponent = (props) => {

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DragItemTypes.SAMPLE,
    drop: () => props.updatePadSample(),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  })

  return (
    <div
      className="sampleDrop"
      ref={drop} >
      <PadComponent
        pad={props.pad}
        kitId={props.kitId}
        padId={props.padId}
        getSampleFilePath={props.getSampleFilePath}
        updatePadSample={props.updatePadSample}
        updatePadIntProperty={props.updatePadIntProperty}
        updatePadStringProperty={props.updatePadStringProperty}
        updatePadSensitivity={props.updatePadSensitivity}
        />
      {isOver && (
        <div className="sampleDropHighlight has-background-warning"/>
      )}
    </div>
  );
};

export default PadRowComponent;
