import { waitForBody, waitForHead } from './utils/init'
import App from './App.vue'
import { ensureAllRawStoresFresh } from './stores/raw'
import { logger } from './utils/logger'
import css from './style.scss?inline'

const main = async () => {
  // 1. 立即开始获取数据
  const pinia = createPinia()
  void ensureAllRawStoresFresh(pinia, false)

  // 2. 等待head出现，注入css
  waitForHead().then(() => {
    const el = document.createElement('style')
    el.textContent = css
    document.documentElement.appendChild(el)
  })

  // 3. 等待body出现，mount app
  waitForBody().then(() => {
    createApp(App)
      .use(pinia)
      .mount(
        (() => {
          const app = document.createElement('div')
          document.body.append(app)
          return app
        })(),
      )
  })
}

main().catch((e) => {
  logger.error('Error in main:', e)
})
