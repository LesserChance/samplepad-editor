import React from 'react';

import './FileList.css';

class FileList extends React.Component {

  render() {
    let sd_card = this.props.sd_card;

    return (
      <div className="FileList">
        {sd_card && sd_card.samples &&
          sd_card.samples.map((file, index) => {
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

export default FileList;
