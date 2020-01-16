import React from 'react';
import SampleComponent from './Sample'

import "../css/SampleList.css"

class SampleListComponent extends React.Component {
  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      filter: ""
    };

    this.filterSamples = this.filterSamples.bind(this);
  }

  filterSamples(filter) {
    this.setState({filter: filter})
  }

  render() {
    return (
      <section className="SampleList">
        <nav className="panel">
          <div className="panel-heading">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  Samples
                </div>
              </div>

              <div className="level-right">
                <i className="is-size-7">({this.props.driveFileCount}/512)</i>
              </div>
            </div>
          </div>

          <div className="panel-block">
            <div className="control has-icons-left">
              <input className="input" type="text" placeholder="Search" onChange={(e) => this.filterSamples(e.target.value)} />
              <span className="icon is-left">
                <i  className="glyphicon glyphicon-search" aria-hidden="true"></i>
              </span>
            </div>
          </div>

          <div className="samples">
            {
              this.props.samples && this.props.samples.map((file, index) => {
                if (file.name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                  return (
                    <SampleComponent
                     key={index}
                     getSampleFilePath={this.props.getSampleFilePath}
                     highlightKeyword={this.state.filter}
                     fileName={file.name} />
                  );
                }
              })
            }
          </div>

          <div class="panel-block">
            <button className="button is-link is-outlined is-fullwidth">
              Import Samples
            </button>
          </div>
        </nav>
      </section>
    );
  }
}

export default SampleListComponent;
