import { useStorage } from '@vueuse/core'
import type { EntmtResponse, LifeResponse } from '@/types/api'

const WORD_HISTORY_MAX_AGE_MS = 5 * 86400 * 1000

type WordTimestampMap = Record<string, number>

const createWordHistoryStore = (id: string, storageKey: string) => {
  return defineStore(id, () => {
    const wordMap = useStorage<WordTimestampMap>(storageKey, {}, localStorage)

    const pruneExpired = (now = Date.now()) => {
      const nextMap: WordTimestampMap = { ...wordMap.value }
      Object.entries(nextMap).forEach(([word, timestamp]) => {
        if (timestamp < now - WORD_HISTORY_MAX_AGE_MS) {
          delete nextMap[word]
        }
      })
      wordMap.value = nextMap
    }

    const touchWords = (words: string[], now = Date.now()) => {
      const nextMap: WordTimestampMap = { ...wordMap.value }
      for (let word of words) {
        word = word.trim()
        if (word) {
          nextMap[word] = now
        }
      }
      wordMap.value = nextMap
      pruneExpired(now)
    }

    const hasWord = (word: string) => {
      word = word.trim()
      if (!word) {
        return false
      }
      return typeof wordMap.value[word] === 'number'
    }

    return {
      wordMap,
      pruneExpired,
      touchWords,
      hasWord,
    }
  })
}

export const useEntmtWordHistoryStore = createWordHistoryStore(
  'history-word-entmt',
  'weibo-hot-no-shit:history:entmt-word-map',
)

export const useLifeWordHistoryStore = createWordHistoryStore(
  'history-word-life',
  'weibo-hot-no-shit:history:life-word-map',
)

export const updateEntmtWordHistory = (response: EntmtResponse) => {
  const store = useEntmtWordHistoryStore()
  const words = response.data.band_list.map((item) => item.word)
  store.touchWords(words)
}

export const updateLifeWordHistory = (response: LifeResponse) => {
  const store = useLifeWordHistoryStore()
  const words = response.data.band_list.map((item) => item.word)
  store.touchWords(words)
}
