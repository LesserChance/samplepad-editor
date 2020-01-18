import React from 'react';
import { connect } from 'react-redux'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import EditKitComponent from './EditKit'
import HeaderComponent from './Header'
import SampleListComponent from './SampleList'
import KitListComponent from './KitList'

const AppComponent = (props) => {
  return (
    <DndProvider backend={Backend}>
      <div className="App">
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
    activeKitId: state.app.activeKitId,
    hasActiveKit: (state.app.activeKitId !== null)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent)