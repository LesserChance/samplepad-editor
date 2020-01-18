export const getSortedKitIds = (kits) => {
  let sortedKits = Object.keys(kits)
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
    })

  return sortedKits.map((kit) => {
      return kit.id
    })
}