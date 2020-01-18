import React from 'react';
import { connect } from 'react-redux'
import SampleComponent from './Sample'
import SamplePlayerComponent from './SamplePlayer'

import "../css/SampleList.css"

class SampleList extends React.Component {
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
                  <i className="is-size-7">({this.props.fileCount}/512)</i>
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
                      <SamplePlayerComponent
                        key={index}
                        sampleFile={this.props.sampleRoot + "/" + file.name}>
                        <SampleComponent
                          fileName={file.name}
                          highlightKeyword={this.state.filter}
                          draggable={true}
                        />
                      </SamplePlayerComponent>
                    );
                  } else {
                    return <span />
                  }
                })
              }
            </div>

            <div className="panel-block">
              <button className="button is-link is-outlined is-fullwidth">
                Import Samples
              </button>
            </div>
          </nav>
        </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    fileCount: state.drive.fileCount,
    samples: state.drive.samples,
    sampleRoot: state.drive.rootPath
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleList)
