/* Global imports */
import React from 'react';
import { connect } from 'react-redux'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

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
      <div className="App">
        <ModalComponent />
        <NoticeComponent notices={props.notices} />
        <HeaderComponent />

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
    </DndProvider>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    notices: state.notices,
    activeKitId: state.app.activeKitId,
    hasActiveKit: (state.app.activeKitId !== null)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent)