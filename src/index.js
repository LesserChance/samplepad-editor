/* Global imports */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

/* App imports */
import store from 'state/store'
import { initEditMenu } from 'menu/edit'
import { initMidiMenu } from 'menu/midi'
import { initDeviceTypeMenu } from 'menu/deviceType'

/* Component imports */
import App from 'component/App'
import 'css/index.css';

/* Initalize Electron App From Renderer Process */
initEditMenu();
initMidiMenu();
initDeviceTypeMenu();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)