/* App imports */
import { Drive } from "util/const";
import { RootModel, KitModel } from "redux/models";

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

  let sampleFiles = fs.readdirSync(rootPath, {withFileTypes: true})
    .filter((dirent, index, arr) => {
      return dirent.isFile()
        && path.extname(dirent.name).toLowerCase() === Drive.SAMPLE_EXTENSION
        && !(/(^|\/)\.[^/.]/g).test(dirent.name)
    })
    .map((dirent) => {
      return dirent.name
    });

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

  let drive = RootModel(rootPath, kitPath, sampleFiles);

  return {drive, kits};
}

