import React from 'react';
import { connect } from 'react-redux'
import { loadDrive } from '../redux/actions'

const HeaderComponent = (props) => {
  return (
    <section className="hero is-small is-primary is-bold">
      <div className="hero-body">
        <div className="container">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">
                  SamplePad Kit Editor
                </h1>
              </div>
            </div>

            <div className="level-right">
              <p className="level-item">
                <a className="button is-link is-outlined" onClick={props.loadCard}>Load SD Card</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadCard: () => {
      dispatch(loadDrive())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
