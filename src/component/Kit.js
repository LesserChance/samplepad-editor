import React from 'react';

import PadComponent from './Pad';
import '../css/Kit.css';

class KitComponent extends React.Component {

  render() {
    let kitId = this.props.kitId;

    return (
      <div className="Kit" key={kitId}>
        {kitId &&
          <div>
            <div>
              <strong>Kit:</strong>
              <input type="text" className="input" defaultValue={this.props.kitName} onChange={(e) => this.props.updateKitProperty('kitName', e.target.value)} />
            </div>

            <div className="mt-2">
              <strong>Pads:</strong>
              <div className="pad-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" className="col-note">Note</th>
                      <th scope="col" className="col-file">File</th>
                      <th scope="col" className="col-velocity">Velocity</th>
                      <th scope="col" className="col-tune">Tune</th>
                      <th scope="col" className="col-sensitivity">Sensitivity</th>
                      <th scope="col" className="col-pan">Pan</th>
                      <th scope="col" className="col-reverb">Reverb</th>
                      <th scope="col" className="col-level">Level</th>
                      <th scope="col" className="col-mode">Mode</th>
                      <th scope="col" className="col-mute-group">Mute Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.kitPads.map((pad, index) => {
                        return (
                          <PadComponent key={index} pad={pad} sampleDrive={this.props.sampleDrive} />
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default KitComponent;
