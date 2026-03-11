import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { waitForBody, waitForHead } from './utils/init'
import App from './App.vue'
import { ensureAllRawStoresFresh } from './stores/raw'

const main = async () => {
  // 1. 立即开始获取数据
  const pinia = createPinia()
  void ensureAllRawStoresFresh(pinia, false)

  // 2. 等待head出现，注入css
  waitForHead().then(() => {
    const style = document.createElement('style')
    style.textContent = `...`
    document.documentElement.appendChild(style)
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

  // 4. 注册油猴菜单
  // Todo: registerMenu
}

main()
