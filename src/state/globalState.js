/* Global imports */
import uuidv1 from 'uuid/v1';

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

  let deviceId = getDeviceIdFromDirectory(rootPath)
  let kits = {};
  let kitPath = rootPath + "/" + Drive.KIT_DIRECTORY;

  SampleStore.loadSamplesFromDirectory(deviceId, rootPath)

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

  let drive = RootModel(deviceId, rootPath, kitPath, Object.keys(SampleStore.getSamples()));

  return {drive, kits};
}

const getDeviceIdFromDirectory = (devicePath) => {
  let deviceId = uuidv1()
  let deviceFile = devicePath + "/" + Drive.DEVICE_ID_FILE

  // look for an existing device id on the card
  if(fs.existsSync(deviceFile)) {
    deviceId = fs.readFileSync(deviceFile, "utf8")
  } else {
    // write the device id to the
    fs.writeFileSync(deviceFile, deviceId)
  }

  return deviceId
}


