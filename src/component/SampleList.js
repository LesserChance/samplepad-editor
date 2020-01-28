/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { importSamples } from 'redux/actions'

/* Component imports */
import SampleComponent from 'component/Sample'
import SamplePlayerComponent from 'component/SamplePlayer'

import "css/SampleList.css"

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
                  <i className="is-size-7">({this.props.samples.length}/512)</i>
                </div>
              </div>
            </div>

            <div className="panel-block">
              <div className="control has-icons-left">
                <input className="input" type="text" placeholder="Search" onChange={(e) => this.filterSamples(e.target.value)} />
                <span className="icon is-left">
                  <i className="glyphicon glyphicon-search" aria-hidden="true"></i>
                </span>
              </div>
            </div>

            <div className="samples">
              {
                this.props.samples && this.props.samples.map((file, index) => {
                  return (
                    <span key={index}>
                       { file.toLowerCase().includes(this.state.filter.toLowerCase()) && (
                          <SamplePlayerComponent
                            sampleFile={this.props.sampleRoot + "/" + file}>
                            <SampleComponent
                              fileName={file}
                              highlightKeyword={this.state.filter}
                              draggable={true}
                            />
                          </SamplePlayerComponent>
                        )
                      }
                    </span>
                  )
                })
              }
            </div>

            <div className="panel-block">
              <button className="button is-link is-outlined is-fullwidth" onClick={this.props.importSamples}>
                Import Samples
              </button>
            </div>
          </nav>
        </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let samples = [];

  if (state.drive.samples) {
    // its ok to sort samples on render because this will rarely change
    samples = state.drive.samples.sort();
  }
  return {
    samples: samples,
    sampleRoot: state.drive.rootPath
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    importSamples: () => {
      dispatch(importSamples());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleList)
