import React from 'react';

class KitListComponent extends React.Component {

  /*
   * @constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.selectElement = null;
    this.setSelectRef = element => {
      this.selectElement = element;
    };

    this.loadKit = this.loadKit.bind(this);
  }

  render() {
    return (
      <div className="KitList">
        <div className="select">
          <select
            value={this.props.selectedKit}
            onChange={(e) => this.props.onChangeKit(e.target.value)}
            ref={this.setSelectRef}>
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
        <a className="button" onClick={this.loadKit}>Edit Kit</a>
        <a className="button" onClick={this.props.onNewKit}>New Kit</a>
      </div>
    );
  }

  loadKit() {
    this.props.onLoadKit(this.selectElement.value);
  }
}

export default KitListComponent;
