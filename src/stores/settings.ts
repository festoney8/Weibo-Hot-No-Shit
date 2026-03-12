import { useGMValue } from '@/composables/useGMValue'
import { logger } from '@/utils/logger'

const KEYWORDS_STORAGE_KEY = 'weibo-hot-no-shit:settings:keywords'
const NAMES_STORAGE_KEY = 'weibo-hot-no-shit:settings:names'

const normalizeList = (items: string[]) => {
  const normalized = items.map((item) => item.trim()).filter((item) => item.length > 0)
  return Array.from(new Set(normalized))
}

const escapeForRegex = (value: string) => {
  return value.replace(/[*+?^${}().|[\]\\]/g, '\\$&')
}

const buildMergedRegex = (items: string[]) => {
  const validNormalParts: string[] = []
  const validBackrefParts: string[] = []

  for (const item of items) {
    const trimmed = item.trim()
    if (!trimmed || trimmed === '//') {
      continue
    }

    const rawPattern = trimmed.startsWith('/') && trimmed.endsWith('/') ? trimmed.slice(1, -1) : escapeForRegex(trimmed)
    try {
      void new RegExp(rawPattern, 'ius')
      const withoutEscapedSlash = rawPattern.replace(/\\\\/g, '')
      if (/\\\d|\\k</.test(withoutEscapedSlash)) {
        validBackrefParts.push(rawPattern)
      } else {
        validNormalParts.push(rawPattern)
      }
    } catch (error) {
      logger.warn('Skip invalid regex pattern in settings:', rawPattern, error)
    }
  }

  const mergedRegex: RegExp[] = []
  try {
    if (validNormalParts.length > 0) {
      mergedRegex.push(new RegExp(validNormalParts.join('|'), 'ius'))
    }
    for (const pattern of validBackrefParts) {
      mergedRegex.push(new RegExp(pattern, 'ius'))
    }
  } catch (error) {
    logger.error('Build merged regex failed in settings store:', error)
  }

  return mergedRegex
}

const matchesByMergedRegex = (value: string, mergedRegex: RegExp[]) => {
  const text = value.trim()
  if (!text) {
    return false
  }
  return mergedRegex.some((regex) => regex.test(text))
}

export const usePluginSettingsStore = defineStore('plugin-settings', () => {
  const keywords = useGMValue<string[]>(KEYWORDS_STORAGE_KEY, [])
  const names = useGMValue<string[]>(NAMES_STORAGE_KEY, [])
  const keywordMergedRegex = computed(() => buildMergedRegex(keywords.value))
  const nameMergedRegex = computed(() => buildMergedRegex(names.value))

  const setKeywords = (nextKeywords: string[]) => {
    keywords.value = normalizeList(nextKeywords)
  }

  const setNames = (nextNames: string[]) => {
    names.value = normalizeList(nextNames)
  }

  const matchKeyword = (value: string) => {
    return matchesByMergedRegex(value, keywordMergedRegex.value)
  }

  const matchName = (value: string) => {
    return matchesByMergedRegex(value, nameMergedRegex.value)
  }

  return {
    keywords,
    names,
    keywordMergedRegex,
    nameMergedRegex,
    setKeywords,
    setNames,
    matchKeyword,
    matchName,
  }
})
