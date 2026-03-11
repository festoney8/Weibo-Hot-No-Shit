import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { EntmtResponse, LifeResponse } from '@/types/api'

const WORD_HISTORY_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

type WordTimestampMap = Record<string, number>

const createWordHistoryStore = (id: string, storageKey: string) => {
  return defineStore(id, () => {
    const wordMap = useStorage<WordTimestampMap>(storageKey, {}, localStorage)

    const pruneExpired = (now = Date.now()) => {
      const minTimestamp = now - WORD_HISTORY_MAX_AGE_MS
      const nextMap: WordTimestampMap = { ...wordMap.value }

      Object.entries(nextMap).forEach(([word, timestamp]) => {
        if (timestamp < minTimestamp) {
          delete nextMap[word]
        }
      })
      wordMap.value = nextMap
    }

    const touchWords = (words: string[], now = Date.now()) => {
      const nextMap: WordTimestampMap = { ...wordMap.value }

      for (const word of words) {
        const normalizedWord = word.trim()
        if (!normalizedWord) {
          continue
        }
        nextMap[normalizedWord] = now
      }
      wordMap.value = nextMap
      pruneExpired(now)
    }

    return {
      wordMap,
      pruneExpired,
      touchWords,
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
