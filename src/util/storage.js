const Store = window.require('electron-store');
const store = new Store();

export function storeLastLoadedDirectory(directory) {
  store.set('lastLoadedDirectory', directory);
}

export function getLastLoadedDirectory() {
  return store.get('lastLoadedDirectory');
}