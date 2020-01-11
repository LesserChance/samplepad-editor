import React from 'react';
import ReactDOM from 'react-dom';

import './css/bootstrap.min.css';
import './css/index.css';

import App from './component/App';
import KitfileParser from "./util/kitfile_parser"

ReactDOM.render(<App kit={KitfileParser.getKit('/Users/admin/Documents/samplepad-editor/TEST.kit')}/>, document.getElementById('root'));