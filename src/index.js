import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducers from './redux/reducers'
import thunk from 'redux-thunk';
import App from './component/App'

import './css/bulma.min.css';
import './css/index.css';

const store = createStore(reducers, applyMiddleware(thunk));
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)