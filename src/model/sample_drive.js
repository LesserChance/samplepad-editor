import KIT_CONSTANTS from '../util/kit_constants'

import Kit from './kit';

const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');

class SampleDrive {
  static defaultState() {
    return {
      /* @var {String} */
      rootPath: "",
      /* @var {String} */
      kitPath: "",
      /* @var {Kit[]} */
      kits: [],
      /* @var {dirent[]} */
      samples: []
    };
  }

  constructor(props) {
    props = Object.assign({}, SampleDrive.defaultState(), props)

    this.rootPath = props.rootPath;
    this.kitPath = props.kitPath;
    this.kits = props.kits;
    this.samples = props.samples;
  }

  getKitById(kit_id) {
    let filtered_kits = this.kits.filter((kit, index) => {
      return kit.id === kit_id;
    });

    if (filtered_kits.length) {
      return filtered_kits[0];
    }

    return null;
  }

  /*
   * Open a dialog to locate the SD card
   * @returns {SampleDrive|null}
   */
  static async openDirectory() {
    return remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      properties:["openDirectory"]
    }).then(result => {
      if (result.canceled) {
        return null;
      }

      return SampleDrive.fromDirectory(result.filePaths[0]);
    }).catch(err => {
      console.log(err);
    })
  }

  /*
   * Create a SampleDrive given the root directoy
   * @param {String} rootPath
   * @returns {SampleDrive}
   */
  static fromDirectory(rootPath) {
    let kitPath = rootPath + "/" + KIT_CONSTANTS.KIT_DIRECTORY;

    let sample_files = fs.readdirSync(rootPath, {withFileTypes: true})
      .filter((dirent, index, arr) => {
        return dirent.isFile()
          && path.extname(dirent.name).toLowerCase() === KIT_CONSTANTS.SAMPLE_EXTENSION
          && !(/(^|\/)\.[^\/\.]/g).test(dirent.name)
      })

    let kit_files = fs.readdirSync(kitPath, {withFileTypes: true})
      .filter((dirent, index, arr) => {
        return dirent.isFile()
          && path.extname(dirent.name).toLowerCase() === KIT_CONSTANTS.KIT_EXTENSION
          && !(/(^|\/)\.[^\/\.]/g).test(dirent.name)
      })

    let kits = kit_files.map((kit_file, index) => {
        return Kit.getUnloadedKit(kitPath, kit_file.name)
      });

    return new SampleDrive({
      rootPath: rootPath,
      kitPath: kitPath,
      samples: sample_files,
      kits: kits
    });
  }
}

export default SampleDrive;