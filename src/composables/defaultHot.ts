import type { HotSearch } from '@/types/hotSearch'
import { useEntmtWordHistoryStore, useLifeWordHistoryStore } from '@/stores/history'
import { useDefaultRawStore } from '@/stores/raw'
import { logger } from '@/utils/logger'

export const useFilteredDefaultHotSearch = () => {
  const defaultRawStore = useDefaultRawStore()
  const { state } = storeToRefs(defaultRawStore)
  const lifeWordHistoryStore = useLifeWordHistoryStore()
  const entmtWordHistoryStore = useEntmtWordHistoryStore()

  const hotSearches = computed<HotSearch[]>(() => {
    const sourceItems = state.value.data?.data.realtime ?? []

    const filteredItems = sourceItems.filter((item) => {
      const word = item.word.trim()
      if (!word) {
        return false
      }
      // 白名单规则
      if (item.icon_desc && ['辟谣'].includes(item.icon_desc.trim())) {
        logger.debug(`保留 default 热搜: ${word}`)
        return true
      }
      // 广告
      if (item.is_ad === 1 || item.topic_ad === 1 || item.small_icon_desc === '商' || item.monitors) {
        logger.debug(`过滤 default 广告热搜: ${word}`)
        return false
      }
      // 按 flag_desc 类别过滤
      if (item.flag_desc && ['剧集', '电影', '综艺', '盛典', '演出'].includes(item.flag_desc.trim())) {
        logger.debug(`过滤 default 分类热搜: ${word}`)
        return false
      }
      // 娱乐生活类
      if (lifeWordHistoryStore.hasWord(word) || entmtWordHistoryStore.hasWord(word)) {
        logger.debug(`过滤 default 娱乐生活热搜: ${word}`)
        return false
      }
      return true
    })

    return filteredItems.map((item, index) => {
      return {
        rank: index + 1,
        word: item.word,
        desc: (item.num / 10000).toFixed(1),
        color: item.icon_desc_color ?? '',
      }
    })
  })

  return {
    hotSearches,
  }
}
