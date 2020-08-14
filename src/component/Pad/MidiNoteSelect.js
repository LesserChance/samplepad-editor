/* Global imports */
import React from 'react';

/* App imports */
import { MidiMap } from 'const'

const MidiNoteSelect = (props) => {
  return (
    <div className="field midiNote">
      <div className="control has-icons-left">
        <div className="select is-small">
          <select
            value={props.value || ""}
            onChange={(e) => props.onChange(e.target.value)}>
            {
              [...Array(127).keys()].map((midiNote) => {
                midiNote = midiNote + 1;
                let defaultNote = MidiMap[props.deviceType][props.padType][1];
                return (
                  <option key={midiNote} value={midiNote}>
                    {midiNote}{(midiNote===defaultNote) ? '*' : ''}
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