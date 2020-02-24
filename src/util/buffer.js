/* Electron imports */
const { fs } = window.api

export const getBuffer = (filePath) => {
  return Buffer.from(fs.readFileBufferArray(filePath));
}