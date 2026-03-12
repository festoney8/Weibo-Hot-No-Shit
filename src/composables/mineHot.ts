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
      // 白名单规则
      if (item.icon_desc && ['辟谣'].includes(item.icon_desc.trim())) {
        return true
      }
      if (item.small_icon_desc === '商' || item.rank === null) {
        // 广告
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
      let desc = ''
      if (typeof item.description === 'number') {
        desc = (item.description / 10000).toFixed(1) + '万'
      } else if (typeof item.description === 'string') {
        if (item.description === '好友正在看') {
          desc = '●'
        } else if (item.description.endsWith('登顶')) {
          desc = '登顶'
        } else if (item.description.endsWith('霸榜')) {
          desc = '霸榜'
        } else {
          desc = item.description
        }
      }
      if (item.icon_desc === '辟谣') {
        desc = '辟谣'
      }
      return {
        rank: index + 1,
        word: item.word,
        desc: desc,
        color: item.icon_desc_color ?? '',
      }
    })
  })

  return {
    hotSearches,
  }
}
