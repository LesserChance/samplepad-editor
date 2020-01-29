/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { PadErrors, PadErrorStrings } from 'const'
import { updatePadIntProperty, updatePadProperty } from 'actions/pad'

/* Component imports */
import SamplePlayerComponent from 'component/SamplePlayer'
import SampleComponent from 'component/Sample'
import VelocityComponent from 'component/Pad/Velocity'

const PadLayerBComponent = (props) => {
  let pad = props.pad;

  return (
    <div className="level PadLayer layerB">
      <div className="level-left">
        <div className="level-item">
          <span className="is-size-7 padName has-background-white-ter">
            Layer B:
          </span>
        </div>

        <div className="level-item">
          <SamplePlayerComponent sampleFile={props.sampleFile}>
            <SampleComponent
              draggable={false}
              removable={true}
              fileName={pad.fileNameB}
              removeSample={() => {props.removePadSample(null)}}
            />
          </SamplePlayerComponent>
        </div>
      </div>

      <div className="level-right">
        <div className="level-item">
          <VelocityComponent
            min={pad.velocityMinB}
            max={pad.velocityMaxB}
            tooltip={props.velocityTooltip}
            hasError={props.hasVelocityError}
            onChangeMin={(value) => props.updatePadIntProperty('velocityMinB', value)}
            onChangeMax={(value) => props.updatePadIntProperty('velocityMaxB', value)} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  let pad = state.pads[ownProps.padId];
  let velocityTooltip = "Velocity: " + pad.velocityMinB + "-" + pad.velocityMaxB;

  let hasVelocityError = false;
  if (pad.errors.indexOf(PadErrors.VELOCITY_SWAPPED_B) > -1) {
    hasVelocityError = true;
    velocityTooltip = "Error: " + PadErrorStrings.VELOCITY_SWAPPED_B;
  } else if (pad.errors.indexOf(PadErrors.VELOCITY_TOO_HIGH_B) > -1) {
    hasVelocityError = true;
    velocityTooltip = "Error: " + PadErrorStrings.VELOCITY_TOO_HIGH_B;
  }

  return {
    pad: pad,
    sampleFile: state.drive.rootPath + "/" +  pad.fileNameB,
    hasVelocityError: hasVelocityError,
    velocityTooltip: velocityTooltip
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePadIntProperty: (property, value) => {
      dispatch(updatePadIntProperty(ownProps.padId, property, value));
    },
    removePadSample: (value) => {
      dispatch(updatePadProperty(ownProps.padId, 'fileNameB', null));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadLayerBComponent)
