/* Global imports */
import React from 'react';
import { connect } from 'react-redux'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

/* App imports */
import { selectAndLoadDrive } from 'actions/drive'

/* Component imports */
import ModalComponent from 'component/Modal'
import NoticeComponent from 'component/Notice'
import EditKitComponent from 'component/EditKit'
import HeaderComponent from 'component/Header'
import SampleListComponent from 'component/SampleList'
import KitListComponent from 'component/KitList'

const AppComponent = (props) => {
  return (
    <DndProvider backend={Backend}>
        {props.showSplash &&
          <div className="App">
            <HeaderComponent showLoadCard={false} />
            <div class="splash is-medium">
              <p>Make sure your SamplePad SD card is inserted into your computer. Click the "Load SD Card" button below and select the root directory of the SD card</p>
              <p><button className="button is-link is-medium" onClick={props.loadCard}>Load SD Card</button></p>
            </div>
          </div>
        }

        {!props.showSplash &&
          <div className="App">
            <ModalComponent />
            <NoticeComponent notices={props.notices} />
            <HeaderComponent showLoadCard={true} />
            <section className="columns">
              <div className="column is-one-quarter">
                <SampleListComponent />
              </div>

              <div className="column is-three-quarters">
                <KitListComponent />

                {props.hasActiveKit &&
                  <EditKitComponent kitId={props.activeKitId} />
                }
              </div>
            </section>
          </div>
        }
    </DndProvider>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    showSplash: !state.drive.deviceId,
    notices: state.notices,
    activeKitId: state.app.activeKitId,
    hasActiveKit: (state.app.activeKitId !== null)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadCard: () => {
      dispatch(selectAndLoadDrive())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent)