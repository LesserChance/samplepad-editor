import React from 'react';
import "../../css/PadControl/Velocity.css"

class VelocityComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      editingMin: false,
      editingMax: false
    };

    this.toggleEditMin = this.toggleEditMin.bind(this);
    this.toggleEditMax = this.toggleEditMax.bind(this);
  }

  toggleEditMin() {
    this.setState({editingMin: !this.state.editingMin});
  }

  toggleEditMax() {
    this.setState({editingMax: !this.state.editingMax});
  }

  render() {
    return (
      <span className="velocityIcon has-tooltip-bottom" data-tooltip={this.props.tooltip}>
        <span className="is-small">
          (
          {this.state.editingMin &&
            <input
              type="text"
              maxLength={3}
              ref={input => input && input.focus()}
              onFocus={(e) => e.target.select()}
              className="input is-static"
              value={this.props.min}
              onBlur={this.toggleEditMin}
              onChange={(e) => this.props.onChangeMin(e.target.value)} />
          }
          {!this.state.editingMin &&
            <span onClick={this.toggleEditMin}>
              {this.props.min}
            </span>
          }
          -
          {this.state.editingMax &&
            <input
              type="text"
              maxLength={3}
              ref={input => input && input.focus()}
              onFocus={(e) => e.target.select()}
              className="input is-static"
              value={this.props.max}
              onBlur={this.toggleEditMax}
              onChange={(e) => this.props.onChangeMax(e.target.value)} />
          }
          {!this.state.editingMax &&
            <span onClick={this.toggleEditMax}>
              {this.props.max}
            </span>
          }
          )
        </span>
      </span>
    );
  }
}

export default VelocityComponent
