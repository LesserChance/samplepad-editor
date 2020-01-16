import React from 'react';
import EditKitComponent from './EditKit'
import HeaderComponent from './Header'
import SampleListComponent from './SampleList'
import KitListComponent from './KitList'

// const AppComponent = React.memo(function AppComponent(props) {
const AppComponent = (props) => {
  console.log("RE-RENDERING APP");
  console.log(props);
  return (
    <div className="App">
      <input
        type="text"
        className="input"
        onChange={(e) => props.updateKitProperty(props.activeKitId, 'kitName', e.target.value)} />
    </div>
  );
}

export default AppComponent;
