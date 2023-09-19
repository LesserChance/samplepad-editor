/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { Drive } from 'const'
import SampleStore from 'util/sampleStore'

/* Component imports */
import SampleComponent from 'component/Sample'
import SamplePlayerComponent from 'component/SamplePlayer'
import 'css/SampleList.css'

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
    this.setState({ filter: filter })
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
                <i className="is-size-7">({this.props.samples ? this.props.samples.length : 0}/{Drive.MAX_SAMPLES})</i>
              </div>

              <button className="glyphicon glyphicon-trash" onClick={this.props.clear} />
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
                    {file.toLowerCase().includes(this.state.filter.toLowerCase()) && (
                      <SamplePlayerComponent
                        sampleFile={file}>
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
  return {
    samples: state.drive.samples
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    importSamples: () => {
      dispatch(SampleStore.importSamples());
    },
    clear: () => {
      dispatch(SampleStore.clear())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleList)
