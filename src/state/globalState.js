/* App imports */
import { Drive } from 'const';
import { RootModel, KitModel } from 'state/models';
import SampleStore from 'util/sampleStore';

/* Electron imports */
const fs = window.require('fs');
const path = window.require('path');

/**
 * @param {String} rootPath
 * @return {RootModel, KitModel[]}
 */
export const getGlobalStateFromDirectory = (rootPath) => {
  if(!fs.existsSync(rootPath)) {
    throw new Error("Invalid directory")
  }

  SampleStore.loadSamplesFromDirectory(rootPath)

  let kits = {};
  let kitPath = rootPath + "/" + Drive.KIT_DIRECTORY;

  if(fs.existsSync(kitPath)) {
    let kitFiles = fs.readdirSync(kitPath, {withFileTypes: true})
      .filter((dirent, index, arr) => {
        return dirent.isFile()
          && path.extname(dirent.name).toUpperCase() === Drive.KIT_EXTENSION
          && !(/(^|\/)\.[^/.]/g).test(dirent.name)
      })

    kitFiles.forEach((kitFile) => {
      let kit = KitModel(kitPath, kitFile.name, null, true, null, kitFile.name.slice(0, -4));
      kits[kit.id] = kit;
    });
  }

  let drive = RootModel(rootPath, kitPath, SampleStore.getSamples());

  return {drive, kits};
}

