/* Global imports */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

/* App imports */
import store from 'state/store'
import { initMidiMenu } from 'util/midiMenu'
import { initDeviceTypeMenu } from 'util/deviceTypeMenu'

/* Component imports */
import App from 'component/App'
import 'css/index.css';

/* Initalize Electron App From Renderer Process */
initMidiMenu();
initDeviceTypeMenu();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)