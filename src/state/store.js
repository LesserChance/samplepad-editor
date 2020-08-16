/* Global imports */
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

/* App imports */
import reducers from 'state/reducers'

/* Initalize React App */
const store = createStore(reducers, applyMiddleware(thunk));

export default store;