import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  base: './',
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
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    port: 5173
  }
})
