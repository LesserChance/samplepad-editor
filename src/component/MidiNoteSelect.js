import React from 'react';
import { MidiMap } from '../util/const'

const MidiNoteSelect = (props) => {
  return (
    <div className="field">
      <div className="control has-icons-left">
        <div className="select is-small">
          <select
            value={props.value || ""}
            onChange={(e) => props.onChange(e.target.value)}>
            {
              Object.keys(MidiMap).map((midiNote) => {
                return (
                  <option key={midiNote} value={midiNote}>
                    {midiNote} &lt;{MidiMap[midiNote]}&gt;
                  </option>
                );
              })
            }
          </select>
          <div className="icon is-small is-left">
            <i className="glyphicon glyphicon-music" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MidiNoteSelect;