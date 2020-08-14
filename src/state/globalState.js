/* Global imports */
import uuidv1 from 'uuid/v1';

/* App imports */
import { Drive, DeviceType } from 'const';
import { RootModel, KitModel } from 'state/models';
import SampleStore from 'util/sampleStore';
import { resetDeviceType } from 'util/deviceTypeMenu'

/* Electron imports */
const { fs } = window.api;

/**
 * @param {String} rootPath
 * @return {RootModel, KitModel[]}
 */
export const getGlobalStateFromDirectory = (rootPath) => {
  if(!fs.exists(rootPath)) {
    throw new Error("Invalid directory")
  }

  let {deviceId, deviceType} = getDeviceDetailsFromDirectory(rootPath)
  let kits = {};
  let kitPath = rootPath + "/" + Drive.KIT_DIRECTORY;

  SampleStore.loadSamplesFromDirectory(deviceId, rootPath)

  if(fs.exists(kitPath)) {
    let kitFiles = fs.getKitFiles(kitPath)

    kitFiles.forEach((kitFile) => {
      let kit = KitModel(kitPath, kitFile.name, null, true, null, kitFile.name.slice(0, -4));
      kits[kit.id] = kit;
    });
  }

  let drive = RootModel(deviceId, deviceType, rootPath, kitPath, Object.keys(SampleStore.getSamples()));

  // set the menu to this drive's device type
  resetDeviceType(deviceType);

  return {drive, kits};
}

const getDeviceDetailsFromDirectory = (devicePath) => {
  let deviceId = uuidv1()
  let deviceFile = devicePath + "/" + Drive.DEVICE_ID_FILE
  let deviceType = DeviceType.SAMPLERACK;

  let writeFile = true;

  // look for an existing device id on the card
  if(fs.exists(deviceFile)) {
    let deviceDetails = fs.readFileAsArrayByLine(deviceFile);
    deviceId = deviceDetails[0];

    if (deviceDetails.length > 1) {
      writeFile = false;
      deviceType = deviceDetails[1];
    }
  }

  if (writeFile) {
    writeDeviceDetailsToFile(devicePath, deviceId, deviceType)
  }

  return {deviceId, deviceType}
}

export const writeDeviceDetailsToFile = (devicePath, deviceId, deviceType) => {
  // todo: should probably store config data as json in device file
  let deviceFile = devicePath + "/" + Drive.DEVICE_ID_FILE
  let deviceDetails = deviceId + "\n";
  deviceDetails += deviceType + "\n";

  fs.writeFile(deviceFile, deviceDetails)
}


