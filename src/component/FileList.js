import React from 'react';

import '../css/FileList.css';

class FileListComponent extends React.Component {

  render() {
    return (
      <div className="FileList">
        <nav className="panel">
          <p className="panel-heading">
            Browse Samples
          </p>

          <div className="panel-block">
            <p className="control has-icons-left">
              <input className="input" type="text" placeholder="Search" />
              <span className="icon is-left">
                <i  className="glyphicon glyphicon-search" aria-hidden="true"></i>
              </span>
            </p>
          </div>

          <div className="samples">
            {this.props.samples && this.props.samples.map((file, index) => {
                return (
                  <a key={index} className="panel-block sample">
                    <span className="panel-icon">
                      <i className="glyphicon glyphicon-file" aria-hidden="true"></i>
                    </span>
                    {file.name}
                  </a>
                );
              })
            }
          </div>
        </nav>
      </div>
    );
  }
}

export default FileListComponent;
