import React from 'react';
import Pad from './Pad';
import './Kit.css';

class Kit extends React.Component {

  constructor(props) {
    super(props);

    this.updateKitProperty = this.updateKitProperty.bind(this);
  }

  render() {
    let kit = this.props.kit;
    console.log(kit);

    return (
      <div className="Kit">
        {kit &&
          <div key={kit.kit_name}>
            <div>
              <strong>Kit:</strong>
              <input type="text" className="form-control" defaultValue={kit.kit_name} onChange={(e) => this.updateKitProperty('kit_name', e.target.value)} />
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
                      {
                      // <th scope="col">filename_b</th>
                      // <th scope="col">display_name_b</th>
                      // <th scope="col">velocity_min_b</th>
                      // <th scope="col">velocity_max_b</th>
                      }
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
                      kit.pads.map((pad, index) => {
                        return (
                          <Pad key={kit.kit_name + "-" + index} pad={pad} />
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

  updateKitProperty(property, value) {
    this.props.kit[property] = value;
  }
}

export default Kit;
