/* App imports */
import { MidiMap } from 'const';

export const getSortedKitIds = (kits) => {
  return Object.keys(kits)
    .map((kitId) => {
      let kit = kits[kitId];
      return {id: kitId, name: kit.kitName, isNew: kit.isNew}
    })
    .sort((a, b) => {
      // new kits are sorted to the top
      if (a.isNew) {
        if (!b.isNew || a.name < b.name) {
          return -1;
        }
      } else if (b.isNew) {
        if (!a.isNew || b.name < a.name) {
          return 1;
        }
      }

      // neither or both kits are new, just sort by name
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    }).map((kit) => {
      return kit.id
    });
}

export const getSortedPadIds = (drive, pads) => {
  let padPriority = Object.keys(MidiMap[drive.deviceType]);

  let ret = Object.keys(pads)
    .map((padId) => {
      let pad = pads[padId];
      return {id: padId, type: pad.padType}
    })
    .sort((a, b) => {
      return (padPriority.indexOf(a.type) > padPriority.indexOf(b.type)) ? 1 : -1;
    }).map((pad) => {
      return pad.id
    });

    return ret;
}