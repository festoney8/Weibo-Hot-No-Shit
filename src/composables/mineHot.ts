import type { HotSearch } from '@/types/hotSearch'
import { useEntmtWordHistoryStore, useLifeWordHistoryStore } from '@/stores/history'
import { useMineRawStore } from '@/stores/raw'
import { logger } from '@/utils/logger'

export const useFilteredMineHotSearch = () => {
  const mineRawStore = useMineRawStore()
  const { state } = storeToRefs(mineRawStore)
  const lifeWordHistoryStore = useLifeWordHistoryStore()
  const entmtWordHistoryStore = useEntmtWordHistoryStore()

  const hotSearches = computed<HotSearch[]>(() => {
    const sourceItems = state.value.data?.data.realtime ?? []

    const filteredItems = sourceItems.filter((item) => {
      const word = item.word.trim()
      if (!word) {
        return false
      }
      // 广告
      if (item.small_icon_desc === '商') {
        logger.debug(`过滤 mine 广告热搜: ${word}`)
        return false
      }
      // 分类
      if (item.icon_desc && ['官宣', '亮相'].includes(item.icon_desc.trim())) {
        logger.debug(`过滤 mine 分类热搜: ${word}`)
        return false
      }
      // 娱乐生活类
      if (lifeWordHistoryStore.hasWord(word) || entmtWordHistoryStore.hasWord(word)) {
        logger.debug(`过滤 mine 娱乐生活热搜: ${word}`)
        return false
      }
      return true
    })

    return filteredItems.map((item, index) => {
      return {
        rank: index + 1,
        word: item.word,
        desc: item.description === '好友正在看' ? '' : item.description,
        color: item.icon_desc_color ?? '',
      }
    })
  })

  return {
    hotSearches,
  }
}
