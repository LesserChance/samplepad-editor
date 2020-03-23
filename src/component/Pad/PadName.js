/* Global imports */
import React from 'react';
import uuidv1 from 'uuid/v1'

/* Electron imports */
const { midi } = window.api

class PadName extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props)

    this.state = {
      playing: false
    }

    this.handlerId = uuidv1()
    this.addMidiHandler()
  }

  render() {
    return (
      <div className="level-item PadMidi">
        <span className={"is-size-7 padName " + ((this.state.playing) ? 'playing has-background-primary': this.props.padClass)}>
          {this.props.padName}:
        </span>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.midi) {
      if (prevProps.midi.note !== this.props.midi.note ||
          prevProps.midi.min !== this.props.midi.min ||
          prevProps.midi.max !== this.props.midi.max) {

        this.removeMidiHandler(prevProps.midi.note)
        this.addMidiHandler()
      }
    }
  }

  componentWillUnmount() {
    if (this.props.midi) {
      this.removeMidiHandler(this.props.midi.note)
    }
  }

  addMidiHandler() {
    if (this.props.midi) {
      midi.addMidiNoteOnHandler(this.handlerId, this.props.midi.note, this.props.midi.min, this.props.midi.max, (e) => {
        this.setState({playing: true})
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.setState({playing: false})
        }, 300)
      })
    }
  }

  removeMidiHandler(note) {
    if (this.handlerId) {
      midi.removeMidiNoteOnHandler(this.handlerId, note)
    }
  }
}

export default PadName
