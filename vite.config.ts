import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import monkey, { util, cdn } from 'vite-plugin-monkey'
import Vue from 'unplugin-vue/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    AutoImport({
      imports: [util.unimportPreset, 'vue', 'vue-router', 'pinia'],
      dts: 'src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dts: 'src/types/components.d.ts',
      /* options */
    }),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Weibo-Hot-No-Shit',
        namespace: 'http://tampermonkey.net/',
        version: '1.0.0',
        description: '净化微博热搜边栏，去除闲杂内容，支持关键词过滤',
        author: 'festoney8',
        homepage: 'https://github.com/festoney8/Weibo-Hot-No-Shit',
        supportURL: 'https://github.com/festoney8/Weibo-Hot-No-Shit',
        license: 'MIT',
        icon: 'https://weibo.com/favicon.ico',
        match: ['*://weibo.com/*', '*://s.weibo.com/*'],
        exclude: [
          // '*://weibo.com/u/*',
          '*://weibo.com/ttarticle/*',
          '*://weibo.com/tv',
          '*://weibo.com/tv/*',
          '*://weibo.com/aj/*',
          '*://s.weibo.com/top/*',
          '*://weibo.com/hot/mine*',
          '*://weibo.com/hot/search*',
          '*://weibo.com/hot/entertainment*',
          '*://weibo.com/hot/life*',
          '*://weibo.com/hot/social*',
        ],
        connect: ['weibo.com'],
        downloadURL: 'https://update.greasyfork.org/scripts/569576/Weibo-Hot-No-Shit.user.js',
        updateURL: 'https://update.greasyfork.org/scripts/569576/Weibo-Hot-No-Shit.meta.js',
        'run-at': 'document-start',
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
