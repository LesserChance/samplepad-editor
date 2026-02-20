/* Global imports */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

/* App imports */
import store from 'state/store'
import { initEditMenu } from 'menu/edit'
import { initMidiMenu } from 'menu/midi'
import { initDeviceTypeMenu } from 'menu/deviceType'

/* Component imports */
import App from 'component/App'
import 'css/bulma.min.css'
import 'css/bulma-tooltip.min.css'
import 'css/icons.css'
import 'css/index.scss'

/* Initalize Electron App From Renderer Process */
initEditMenu();
initMidiMenu();
initDeviceTypeMenu();

const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
