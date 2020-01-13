import React from 'react';

import PadComponent from './Pad';
import './Kit.css';

class KitComponent extends React.Component {

  render() {
    let kitId = this.props.kitId;

    return (
      <div className="Kit" key={kitId}>
        {kitId &&
          <div>
            <div>
              <strong>Kit:</strong>
              <input type="text" className="form-control" defaultValue={this.props.kitName} onChange={(e) => this.props.updateKitProperty('kitName', e.target.value)} />
            </div>

            <div className="mt-2">
              <strong>Pads:</strong>
              <div className="pad-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Note</th>
                      <th scope="col">File</th>
                      <th scope="col">Name</th>
                      <th scope="col">Velocity</th>
                      <th scope="col">Tune</th>
                      <th scope="col">Sensitivity</th>
                      <th scope="col">Pan</th>
                      <th scope="col">Reverb</th>
                      <th scope="col">Level</th>
                      <th scope="col">Mode</th>
                      <th scope="col">Mute Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.kitPads.map((pad, index) => {
                        return (
                          <PadComponent key={index} pad={pad} />
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
