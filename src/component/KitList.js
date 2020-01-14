import React from 'react';

class KitListComponent extends React.Component {

  render() {
    return (
      <div className="KitList">
        <div className="select">
          <select
            value={this.props.selectedKit}
            onChange={(e) => this.props.onChangeKit(e.target.value)}>
            {
              this.props.kits &&
              this.props.kits.map((kit, index) => {
                return (
                  <option key={kit.id} value={kit.id}>
                    {kit.isNew &&
                      "<New> " + kit.kitName
                    }
                    {!kit.isNew &&
                      kit.fileName
                    }
                  </option>
                );
              })
            }
          </select>
        </div>
        <a className="button" onClick={this.props.onLoadKit}>Edit Kit</a>
        <a className="button" onClick = {this.props.onSaveKit}>Save Kit</a>
        {this.props.kitIsExisting &&
          <a className="button" onClick = {this.props.onSaveNewKit}>Save as New Kit</a>
        }
      </div>
    );
  }
}

export default KitListComponent;
