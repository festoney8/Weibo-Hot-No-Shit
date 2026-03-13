import { type WatchOptions } from 'vue'
import { watchDebounced } from '@vueuse/core'
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
  debounceMs?: number
}

export const useGMValue = <T>(key: string, initialValue: T, options: UseGMValueOptions = {}) => {
  const { deep = true, flush = 'pre', listenToChanges = true, debounceMs = 1000 } = options
  const state = ref(GM_getValue<T>(key, initialValue))
  let ms = debounceMs
  if (ms <= 0) {
    ms = 200
  }
  watchDebounced(
    state,
    (value) => {
      GM_setValue(key, value)
    },
    {
      deep,
      flush,
      debounce: ms,
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
