import { defineConfig } from 'electron-vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path'

const root = process.cwd()

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    root: 'src',
    plugins: [nodePolyfills({ include: ['buffer'] })],
    build: {
      outDir: resolve(root, 'out/renderer')
    },
    resolve: {
      alias: {
        component: resolve(root, 'src/component'),
        state: resolve(root, 'src/state'),
        actions: resolve(root, 'src/actions'),
        menu: resolve(root, 'src/menu'),
        util: resolve(root, 'src/util'),
        css: resolve(root, 'src/css'),
        const: resolve(root, 'src/const.js')
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    }
  }
})
