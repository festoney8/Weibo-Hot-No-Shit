import { type WatchOptions } from 'vue'
import {
  GM_addValueChangeListener,
  GM_getValue,
  GM_removeValueChangeListener,
  GM_setValue,
  type GmValueListenerId,
} from 'vite-plugin-monkey/dist/client'

type UseGMValueOptions = {
  deep?: boolean
  flush?: WatchOptions['flush']
  listenToChanges?: boolean
}

export const useGMValue = <T>(key: string, initialValue: T, options: UseGMValueOptions = {}) => {
  const { deep = true, flush = 'pre', listenToChanges = true } = options

  const state = ref<T>(GM_getValue(key, initialValue) as T)

  watch(
    state,
    (value) => {
      GM_setValue(key, value)
    },
    {
      deep,
      flush,
    },
  )

  let listenerId: GmValueListenerId | undefined
  if (listenToChanges) {
    listenerId = GM_addValueChangeListener(key, (_name, _oldValue, newValue) => {
      state.value = newValue as T
    })
  }

  onScopeDispose(() => {
    if (listenerId != null) {
      GM_removeValueChangeListener(listenerId)
    }
  })

  return state
}
