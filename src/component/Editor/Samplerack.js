/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* Component imports */
import PadRowComponent from 'component/Pad/Row'

const EditKit = (props) => {

  return (
    <div className="pad-table">
      {
        props.pads.map((padId) => {
          return (
            <PadRowComponent padId={padId} key={padId} />
          );
        })
      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  let kit = state.kits.models[ownProps.kitId];

  return {
    pads: kit.pads
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditKit)
