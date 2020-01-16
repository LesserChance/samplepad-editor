import React from 'react';
import SampleComponent from './Sample'

import "../css/SampleList.css"

const SampleListComponent = React.memo(function SampleListComponent(props) {
  console.log("RE-RENDERING SampleListComponent");
  console.log(props);
  return (
    <section className="SampleList">
      <nav className="panel">
        <div className="panel-heading">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                Samples
              </div>
            </div>

            <div className="level-right">
              <i className="is-size-7">({props.driveFileCount}/512)</i>
            </div>
          </div>
        </div>

        <div className="panel-block">
          <div className="control has-icons-left">
            <input className="input" type="text" placeholder="Search" />
            <span className="icon is-left">
              <i  className="glyphicon glyphicon-search" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        <div className="samples">
          {props.samples && props.samples.map((file, index) => {
              return (
                <SampleComponent
                 key={index}
                 getSampleFilePath={props.getSampleFilePath}
                 fileName={file.name} />
              );
            })
          }
        </div>
      </nav>
    </section>
  );
})

export default SampleListComponent;
