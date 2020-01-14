import React from 'react';
import ReactDOM from 'react-dom';

import './css/bulma.min.css';
import './css/index.css';

import AppComponent from './component/App';
import SampleDrive from "./model/sample_drive"

ReactDOM.render(
  <AppComponent
    sampleDrive={SampleDrive.fromDirectory('/Volumes/SAMPLERACK')}
    />, document.getElementById('root'));