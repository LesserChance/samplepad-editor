/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { updatePadIntProperty } from 'redux/actions'

/* Component imports */
import SamplePlayerComponent from 'component/SamplePlayer'
import SampleComponent from 'component/Sample'
import VelocityComponent from 'component/Pad/Velocity'

const PadLayerBComponent = (props) => {
  let pad = props.pad;

  return (
    <div className="level layerB">
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
              fileName={pad.fileNameB}
            />
          </SamplePlayerComponent>
        </div>
      </div>

      <div className="level-right">
        <div className="level-item">
          <VelocityComponent
            min={pad.velocityMinB}
            max={pad.velocityMaxB}
            tooltip={"Velocity: " + pad.velocityMinB + "-" + pad.velocityMaxB}
            onChangeMin={(value) => props.updatePadIntProperty('velocityMinB', value)}
            onChangeMax={(value) => props.updatePadIntProperty('velocityMaxB', value)} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  let pad = state.pads[ownProps.padId];
  return {
    pad: pad,
    sampleFile: state.drive.rootPath + "/" +  pad.fileNameB,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePadIntProperty: (property, value) => {
      dispatch(updatePadIntProperty(ownProps.padId, property, value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PadLayerBComponent)
