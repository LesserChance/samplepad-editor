/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { getPadWithType } from 'util/kitFile'

/* Component imports */
import PadRowComponent from 'component/Pad/Row'

const EditKit = (props) => {

  return (
    <div className="pad-table">
      <div className="is-size-5">Main Pads</div>
      {
        props.mainPads.map((pad) => {
          return (
            <PadRowComponent padId={pad.id} key={pad.id} />
          );
        })
      }

      <div className="mt-5 is-size-5">External Pads</div>
      {
        props.extPads.map((pad) => {
          return (
            <PadRowComponent padId={pad.id} key={pad.id} />
          );
        })
      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  let kit = state.kits.models[ownProps.kitId];

  return {
    mainPads: [
      getPadWithType(kit, state.pads, "pad_01"),
      getPadWithType(kit, state.pads, "pad_02"),
      getPadWithType(kit, state.pads, "pad_03"),
      getPadWithType(kit, state.pads, "pad_04"),
      getPadWithType(kit, state.pads, "pad_05"),
      getPadWithType(kit, state.pads, "pad_06"),
      getPadWithType(kit, state.pads, "pad_07"),
      getPadWithType(kit, state.pads, "pad_08"),
    ],
    extPads: [
      getPadWithType(kit, state.pads, "ext_1a"),
      getPadWithType(kit, state.pads, "ext_1b"),
      getPadWithType(kit, state.pads, "ext_2"),
      getPadWithType(kit, state.pads, "kick"),
      getPadWithType(kit, state.pads, "hh_ope"),
      getPadWithType(kit, state.pads, "hh_mid"),
      getPadWithType(kit, state.pads, "hh_clo"),
      getPadWithType(kit, state.pads, "hh_chk"),
      getPadWithType(kit, state.pads, "hh_spl"),
    ]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditKit)
