"use strict";
const { contextBridge } = require("electron");
const path = require("./rendererApi/path");
const wav = require("./rendererApi/wav");
const fs = require("./rendererApi/fs");
const store = require("./rendererApi/store");
const dialog = require("./rendererApi/dialog");
const midi = require("./rendererApi/midi");
const mainProcessCallbacks = require("./events/mainProcessCallbacks");
const mainProcessTriggers = require("./events/mainProcessTriggers");
const mainProcessEvents = require("./events/mainProcessEvents");
contextBridge.exposeInMainWorld(
  "api",
  {
    path,
    wav,
    fs,
    store,
    dialog,
    midi,
    mainProcessTriggers,
    mainProcessCallbacks
  }
);
mainProcessEvents.initIpcRendererSender();
