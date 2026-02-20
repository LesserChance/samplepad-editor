# Modernize SamplePad Editor for macOS Tahoe / Apple Silicon

## Context

Electron 10.1.3 has no ARM64 binary, so the app can't build on Apple Silicon. The entire build toolchain (CRA, node-sass-chokidar, craco) is deprecated. We modernized infrastructure while keeping the app functionally identical. Target: macOS only (ARM64 + x64).

## Final Architecture

- **Electron 35.7.5** (latest stable, full ARM64 + macOS Tahoe support)
- **Vite 6.4** (direct Vite dev server, no electron-vite wrapper)
- **React 18.3** (needed for modern react-dnd, react-redux compatibility)
- **Vite native SCSS** with `sass` package
- **Redux 4.x + redux-thunk 2.x** stay as-is (avoid `createStore` deprecation in Redux 5)
- **react-redux 8.x** (React 18 compatible, still supports `connect()`)
- Main process + preload stay **CommonJS**
- **Simplified dev setup**: `concurrently` runs Vite + Electron separately

### Why not electron-vite?

Initially planned to use electron-vite, but encountered bundling issues where local `require()` calls in the main process weren't being bundled, causing MODULE_NOT_FOUND errors. Switched to a simpler approach: Vite handles renderer only, Electron runs unbundled main/preload from source.

---

## Implementation Steps

### Step 1: Restructure directories

Moved Electron main/preload files from `public/` to `electron/`:

| From | To |
|---|---|
| `public/electron.js` | `electron/main.js` |
| `public/preload.js` | `electron/preload.js` |
| `public/rendererApi/` (6 files) | `electron/rendererApi/` |
| `public/mainApi/menu.js` | `electron/mainApi/menu.js` |
| `public/events/` (5 files) | `electron/events/` |
| `public/const.js` | `electron/const.js` |
| `public/index.html` | `src/index.html` |

**Deleted:** `manifest.json`, `craco.config.js`, `.env`

**Kept:** `assets/` directory for electron-builder icons

---

### Step 2: Update dependencies

**Removed:**
- `@craco/craco`, `react-scripts`, `react-dev-utils` (CRA)
- `node-sass-chokidar` (replaced by `sass`)
- `electron-is-dev` (use `!app.isPackaged`)
- `electron-rebuild` (electron-builder handles native deps)
- `yarn-run-all` (not needed)

**Installed:**
- `electron@^35.7.5`
- `vite@^6.2.0`
- `sass@^1.86.0`
- `electron-builder@^25.1.8`
- `concurrently@^9.2.1` (run Vite + Electron in parallel)
- `wait-on@^9.0.4` (wait for Vite server before starting Electron)

**Upgraded:**
| Package | From | To |
|---|---|---|
| `react` | ^16.12 | ^18.3.1 |
| `react-dom` | ^16.12 | ^18.3.1 |
| `react-redux` | ^7.1 | ^8.1.3 |
| `react-dnd` | ^11.1.3 | ^16.0.1 |
| `react-dnd-html5-backend` | ^11.1.3 | ^16.0.1 |
| `rc-slider` | ^9.3.1 | ^11.1.7 |
| `electron-store` | ^6 | ^7.0.0 |
| `uuid` | ^8.3 | ^11.0.5 |
| `immutability-helper` | ^3.0 | ^3.1.1 |

**Kept:**
- `redux@^4.2.1` + `redux-thunk@^2.4.2`
- `webmidi@^2.5.3` (v3 is a complete rewrite)
- `wavefile@^11.0.0`
- `react-simple-popover@^0.2.4`

---

### Step 3: Create `vite.config.js`

Created simplified Vite config for renderer process only:

```js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  plugins: [],
  build: {
    outDir: resolve(process.cwd(), 'build'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      component: resolve(process.cwd(), 'src/component'),
      state: resolve(process.cwd(), 'src/state'),
      actions: resolve(process.cwd(), 'src/actions'),
      menu: resolve(process.cwd(), 'src/menu'),
      util: resolve(process.cwd(), 'src/util'),
      css: resolve(process.cwd(), 'src/css'),
      const: resolve(process.cwd(), 'src/const.js')
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  server: {
    port: 5173
  }
})
```

Key points:
- `root: 'src'` - Vite serves from src/ directory
- `resolve.alias` - Replaces CRA's `NODE_PATH=src/`
- `esbuild.loader: 'jsx'` - Handles JSX in .js files
- No node polyfills plugin needed (import Buffer directly where used)

---

### Step 4: Fix removed `electron.remote` module

#### `electron/rendererApi/dialog.js`

```js
const { ipcRenderer } = require("electron")
module.exports = {
  showOpenDialog: (options) => {
    return ipcRenderer.invoke('dialog:showOpenDialog', options)
  }
}
```

#### `electron/rendererApi/wav.js`

```js
// Removed: const { remote } = require("electron")
const spawn = require('child_process').spawn
// Changed: remote.process.platform → process.platform
switch (process.platform) {
  // ...
}
```

---

### Step 5: Update `electron/main.js`

```js
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')
const mainProcessEvents = require('./events/mainProcessEvents')
const { getMenuTemplate } = require('./mainApi/menu')

// Initialize electron-store in main process (required for contextIsolation: true)
const store = new Store()

let mainWindow

function createWindow() {
  // Dialog IPC handler (replaces removed remote.dialog)
  ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
    return dialog.showOpenDialog(options)
  })

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 780,
    minWidth: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
  }

  mainWindow.on('closed', () => mainWindow = null)

  const menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)

  mainProcessEvents.initIpcMainReceiver()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit() }
})
app.on('activate', () => {
  if (mainWindow === null) { createWindow() }
})
```

Key changes:
- Added `Store` initialization in main process (required for electron-store v7 with contextIsolation)
- Moved `ipcMain.handle` into `createWindow()` (must be after app is ready)
- Removed `electron-is-dev`, use `!app.isPackaged` instead
- Preload path is `./preload.js` (relative to main.js location)

---

### Step 6: Fix `electron/events/mainProcessEvents.js`

Critical fix for module-level requires:

```js
const { ipcMain } = require('electron')  // Only import ipcMain at top level
// ...

module.exports = {
  initIpcRendererSender: () => {
    const { ipcRenderer } = require('electron')  // Import inside function for preload context
    window.addEventListener('message', event => {
      const message = event.data
      if (message.type) {
        ipcRenderer.send(message.type, message)
      }
    });
  },
  // ...
}
```

**Why:** The main process file requires `mainProcessEvents` at module load time. If `ipcRenderer` is required at the top level, it will fail because `ipcRenderer` is only available in renderer/preload contexts.

---

### Step 7: Update `electron/mainApi/menu.js`

Removed `electron-is-dev`:

```js
// Deleted: const isDev = require('electron-is-dev');
// The condition if (isDev || !isDev) always evaluated to true anyway
```

---

### Step 8: Update `src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SamplePad Kit Editor" />
    <title>SamplePad Kit Editor</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/index.js"></script>
  </body>
</html>
```

Changes: Removed `%PUBLIC_URL%` (CRA-specific), added Vite entry point.

---

### Step 9: SCSS migration

#### Changed CSS imports to SCSS (9 files):

| File | Change |
|---|---|
| `src/index.js` | `'css/index.css'` → `'css/index.scss'` |
| `src/component/EditKit.js` | `'css/EditKit.css'` → `'css/EditKit.scss'` |
| `src/component/Notice.js` | `'css/Notice.css'` → `'css/Notice.scss'` |
| `src/component/SampleList.js` | `'css/SampleList.css'` → `'css/SampleList.scss'` |
| `src/component/Pad/Row.js` | `'css/Pad.css'` → `'css/Pad.scss'` |
| `src/component/Pad/SlideControl.js` | `'css/Pad/Control.css'` → `'css/Pad/Control.scss'` |
| `src/component/Pad/KnobControl.js` | `'css/Pad/Control.css'` → `'css/Pad/Control.scss'` |
| `src/component/Pad/Velocity.js` | `'css/Pad/Velocity.css'` → `'css/Pad/Velocity.scss'` |
| `src/component/Pad/MuteGroup.js` | `'css/Pad/MuteGroup.css'` → `'css/Pad/MuteGroup.scss'` |

#### Updated `src/index.js` imports:

Added direct CSS imports before SCSS:
```js
import 'css/bulma.min.css'
import 'css/bulma-tooltip.min.css'
import 'css/icons.css'
import 'css/index.scss'
```

#### Deleted generated `.css` files:
- `src/css/EditKit.css`
- `src/css/Notice.css`
- `src/css/Pad.css`
- `src/css/SampleList.css`
- `src/css/index.css`
- `src/css/Pad/Control.css`
- `src/css/Pad/MuteGroup.css`
- `src/css/Pad/Velocity.css`

---

### Step 10: React 18 upgrade in `src/index.js`

```js
import { createRoot } from 'react-dom/client'
// ...
const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}><App /></Provider>
)
```

---

### Step 11: Fix rc-slider `handle` prop

Both `src/component/Pad/SlideControl.js` and `src/component/Pad/KnobControl.js`:

```jsx
<Slider
  ...
  handleRender={(node, handleProps) => this.getHandle(handleProps)}
  ...
/>
```

---

### Step 12: Fix Buffer imports

Added explicit Buffer imports where needed:

**`src/util/buffer.js`:**
```js
import { Buffer } from 'buffer'
const { fs } = window.api

export const getBuffer = (filePath) => {
  return Buffer.from(fs.readFileBufferArray(filePath));
}
```

**`src/util/kitFile.js`:**
```js
import { Buffer } from 'buffer'
// ... rest of imports
```

**Why:** Vite doesn't provide global Buffer polyfills. Importing directly from 'buffer' package avoids polyfill conflicts.

---

### Step 13: Update `package.json`

```json
{
  "name": "samplepad-editor",
  "productName": "SamplePad Kit Editor",
  "description": "Build drum kits for the Alesis SamplePad",
  "author": "Ryan Bateman",
  "version": "0.8.0",
  "private": true,
  "main": "electron/main.js",
  "scripts": {
    "dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "build": "vite build",
    "pack": "vite build && electron-builder build --mac"
  },
  "build": {
    "appId": "com.electron.samplepadeditor",
    "productName": "SamplePad Kit Editor",
    "files": ["build/**/*", "electron/**/*"],
    "directories": { "buildResources": "assets" },
    "mac": {
      "category": "public.app-category.music",
      "target": [{ "target": "dmg", "arch": ["arm64", "x64"] }]
    }
  }
}
```

Key changes:
- `main: "electron/main.js"` - Points to unbundled main process source
- `dev` script uses concurrently to run Vite + Electron in parallel
- `wait-on` ensures Vite server is ready before Electron starts
- Build files include both `build/` (renderer) and `electron/` (main/preload source)

---

## Critical Fixes Discovered During Implementation

### 1. electron-store initialization

**Problem:** With `contextIsolation: true`, electron-store v7 requires initialization in both main and preload processes.

**Solution:** Added `const store = new Store()` at the top of `electron/main.js` before app.ready.

### 2. ipcMain timing

**Problem:** Calling `ipcMain.handle()` at module load time (before app is ready) causes `ipcMain` to be undefined.

**Solution:** Moved IPC handler registration into `createWindow()` function, which runs after app.ready.

### 3. ipcRenderer in main process module

**Problem:** `electron/events/mainProcessEvents.js` is loaded by `electron/main.js` at module load time, but tried to require `ipcRenderer` (only available in renderer/preload).

**Solution:** Only require `ipcMain` at top level. Require `ipcRenderer` inside the `initIpcRendererSender()` function that runs in preload context.

### 4. JSX in .js files

**Problem:** Vite doesn't treat `.js` files as JSX by default.

**Solution:** Added esbuild configuration to handle JSX in .js files:
```js
esbuild: {
  loader: 'jsx',
  include: /.*\.jsx?$/
}
```

---

## Files with NO changes

- All Redux state (`src/state/*`)
- All Redux actions (`src/actions/*`)
- Most components (App.js, EditKit.js, Header.js, KitList.js, Modal.js, Sample.js, SamplePlayer.js, Pad/*.js except SlideControl and KnobControl)
- All utilities except buffer.js and kitFile.js
- Menu initializers (`src/menu/*`)
- Constants (`src/const.js`)
- Most Electron modules (events, rendererApi except dialog.js and wav.js)
- All SCSS source files (only imports changed, not styles)

---

## Known Issues

### Minor DOM nesting warning
```
Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
```
Location: KitList component has a `<div>` inside a `<p>` tag (invalid HTML but doesn't affect functionality).

---

## Verification Checklist

- ✅ `npm install` - all dependencies resolve
- ✅ `npm run dev` - Vite + Electron start successfully
- ✅ App renders without critical errors
- ⏳ Load SD card directory - file dialog opens via IPC
- ⏳ Edit kit pad - rc-slider controls work
- ⏳ Drag sample onto pad - react-dnd works
- ⏳ Preview sample - audio plays
- ⏳ `npm run pack` - produces macOS .dmg (ARM64 + x64)

---

## Build Output Structure

### Development
- Vite dev server runs on http://localhost:5173
- Main process runs unbundled from `electron/main.js`
- Preload runs unbundled from `electron/preload.js`

### Production
- Renderer built to `build/` directory
- Main/preload copied unbundled to package (electron-builder bundles them)
- DMG contains both ARM64 and x64 binaries

---

## Lessons Learned

1. **Keep it simple:** Direct Vite is simpler than electron-vite for this use case
2. **Module loading timing matters:** Be careful about when modules are required in Electron
3. **Context isolation requires care:** electron-store and IPC patterns need main process initialization
4. **Polyfills can conflict:** Better to import explicitly than use global polyfills
5. **Unbundled main process is fine:** No need to bundle main/preload for development
