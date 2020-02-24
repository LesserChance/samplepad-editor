/* Global imports */
import React from 'react'
import uuidv1 from 'uuid/v1'
import update from 'immutability-helper'

/* App imports */
import SampleStore from 'util/sampleStore'

/* Electron imports */
const { playWavFile, stopWavFile, addMidiNoteOnHandler, removeMidiNoteOnHandler } = window.api


class SamplePlayerComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props)

    this.state = {
      wavStack: [],
      player: null,
      playingSample: false
    }


    this.renderChildren = this.renderChildren.bind(this)
    this.playOrStopSample = this.playOrStopSample.bind(this)

    if (this.props.sampleFile && props.midi) {
      this.midi = props.midi
      this.handlerId = uuidv1()
      addMidiNoteOnHandler(this.handlerId, props.midi.note, props.midi.min, props.midi.max, (e) => {
        this.playSample()
      })
    }
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        playOrStopSample: this.playOrStopSample,
        playingSample: this.state.playingSample
      })
    })
  }

  render() {
    return (
      <div>
        {this.renderChildren()}
      </div>
    )
  }

  stopSample() {
    for (let i = 0; i < this.state.wavStack.length; i++) {
      stopWavFile(this.state.wavStack[i])
    }

    this.setState({
      playingSample: false,
      wavStack: []
    })
  }

  playSample() {
    let wavId = uuidv1()

    this.setState(update(this.state, {
      playingSample: {$set: true},
      wavStack: {$push: [wavId]}
    }))

    playWavFile(wavId,SampleStore.getFileNameOnDisk(this.props.sampleFile))
      .then(() => {
        this.setState(update(this.state, {
          playingSample: {$set: (this.state.wavStack.length > 1)},
          wavStack: {$splice: [[this.state.wavStack.indexOf(wavId), 1]]}
        }))
      })
  }

  playOrStopSample() {
    if (this.state.playingSample) {
      this.stopSample()
      return
    }

    this.playSample()
  }

  componentWillUnmount() {
    if (this.handlerId) {
      removeMidiNoteOnHandler(this.handlerId, this.midi.note)
    }
  }
}

export default SamplePlayerComponent
