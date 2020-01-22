import React from 'react';
import Popover from 'react-simple-popover';
import "../../css/PadControl/MuteGroup.css"

class MuteGroupComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  openPopover = (e) => {
    this.setState({open: !this.state.open});
  }

  handleClose = (e) => {
    this.setState({open: false});
  }

  getMgrpBackgroundColor(value) {
    // 0 to 16
    return [
      '#ffffff',
      '#73dc32','#d12394','#2394d1','#ffb3b3',
      '#79ff57','#dd57ff','#ffdd57','#d16023',
      '#5779ff','#00d1b2','#d1001f','#d1b200',
      '#3273dc','#dc9b32','#9b32dc','#001fd1'
    ][value];
  }

  getMgrpForegroundClass(value) {
    if ([2,3,8,9,11,13,15,16].indexOf(value) > -1) {
      // these background colors require light text
      return 'has-text-white';
    }

    // other background colors require dark text
    return 'has-text-black';
  }

  render() {
    return (
      <div className="mgrpContainer">
        <span
          ref={(node) => { this.target = node }}
          onClick={this.openPopover}
          className={"mgrpIcon has-tooltip-left " + this.getMgrpForegroundClass(this.props.mgrp)}
          style={{backgroundColor: this.getMgrpBackgroundColor(this.props.mgrp)}}
          data-tooltip={this.props.tooltip}>
          {this.props.mgrp > 0 ? this.props.mgrp : '-'}
        </span>

        <Popover
          placement='bottom'
          hideWithOutsideClick={true}
          container={this}
          target={this.target}
          show={this.state.open}
          style={{width:'8em',padding:'0.6em'}}
          onHide={this.handleClose}>
          <div className="selectMgrp">
            {this.props.mgrp > 0 &&
              <a href="#" onClick={(e) => {this.props.onChange(0);this.handleClose();}}>
                Remove
              </a>
            }
            {
              [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((mgrp) => {
                return <span
                  key={mgrp}
                  className={"mgrpIcon " + this.getMgrpForegroundClass(mgrp)}
                  onClick={(e) => {this.props.onChange(mgrp);this.handleClose();}}
                  style={{backgroundColor: this.getMgrpBackgroundColor(mgrp)}}>
                  {mgrp > 0 ? mgrp : '-'}
                </span>
              })
            }
          </div>
        </Popover>
      </div>
    );
  }
}

export default MuteGroupComponent
