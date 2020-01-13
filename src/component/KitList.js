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
        <select
          ref={this.setSelectRef}
          className="form-control">
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

        <button onClick={this.loadKit}>Load Kit</button>
        <button onClick={this.props.onNewKit}>New Kit</button>
      </div>
    );
  }

  loadKit() {
    this.props.onLoadKit(this.selectElement.value);
  }
}

export default KitListComponent;
