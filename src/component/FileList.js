import React from 'react';

import '../css/FileList.css';

class FileListComponent extends React.Component {

  render() {
    return (
      <div className="FileList">
        {this.props.samples && this.props.samples.map((file, index) => {
            return (
              <div key={index}>
                {file.name}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default FileListComponent;
