/* Global imports */
import React from 'react';
import { connect } from 'react-redux'

/* App imports */
import { DeviceType } from 'const'
import { selectAndLoadDrive } from 'actions/drive'

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
                <div className="is-outlined">{ props.deviceType }</div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state, ownProps) => {
  let deviceType = "";
  switch (state.drive.deviceType) {
    case DeviceType.SAMPLEPAD_PRO:
      deviceType = "SAMPLEPAD PRO";
      break;
    case DeviceType.SAMPLERACK:
      deviceType = "SAMPLERACK";
      break;
  }

  return {
    deviceType: deviceType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadCard: () => {
      dispatch(selectAndLoadDrive())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
