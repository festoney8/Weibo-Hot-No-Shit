import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Weibo-Hot-No-Shit',
        namespace: 'http://tampermonkey.net/',
        version: '0.1.0',
        description: 'Remove shit from weibo hotsearch sidebar',
        author: 'festoney8',
        homepage: 'https://github.com/festoney8/Weibo-Hot-No-Shit',
        supportURL: 'https://github.com/festoney8/Weibo-Hot-No-Shit',
        license: 'MIT',
        icon: 'https://weibo.com/favicon.ico',
        match: ['*://weibo.com/', '*://s.weibo.com/*'],
        'run-at': 'document-start',
        downloadURL: '',
        updateURL: '',
      },
      build: {
        externalGlobals: {
          vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
