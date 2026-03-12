<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useFilteredDefaultHotSearch } from './composables/defaultHot'
import { useFilteredMineHotSearch } from './composables/mineHot'
import { useDefaultRawStore, useMineRawStore } from './stores/raw'
import { logger } from './utils/logger'

const activeSource = ref<'mine' | 'default'>('mine')

const mineRawStore = useMineRawStore()
const defaultRawStore = useDefaultRawStore()
const { loading: mineLoading } = storeToRefs(mineRawStore)
const { loading: defaultLoading } = storeToRefs(defaultRawStore)

const { hotSearches: mineHotSearches } = useFilteredMineHotSearch()
const { hotSearches: defaultHotSearches } = useFilteredDefaultHotSearch()

const currentList = computed(() => {
  return activeSource.value === 'mine' ? mineHotSearches.value : defaultHotSearches.value
})

const isRefreshing = computed(() => {
  return activeSource.value === 'mine' ? mineLoading.value : defaultLoading.value
})

const refreshCurrent = async () => {
  try {
    if (activeSource.value === 'mine') {
      await mineRawStore.refresh()
      return
    }
    await defaultRawStore.refresh()
  } catch (error) {
    logger.error('Manual refresh failed:', error)
  }
}

const buildWeiboSearchUrl = (word: string) => {
  return `https://s.weibo.com/weibo?q=${encodeURIComponent(`#${word}#`)}`
}
</script>

<template>
  <aside class="hot-sidebar" aria-label="微博热搜侧栏">
    <header class="hot-sidebar__header">
      <h2 class="hot-sidebar__title">微博热搜</h2>
      <button class="hot-sidebar__refresh" type="button" :disabled="isRefreshing" @click="refreshCurrent">
        <span class="hot-sidebar__refresh-icon" :class="{ 'is-spinning': isRefreshing }">↻</span>
        <span>点击刷新</span>
      </button>
    </header>

    <div class="hot-sidebar__tabs" role="tablist" aria-label="热搜来源切换">
      <button
        class="hot-sidebar__tab"
        :class="{ 'is-active': activeSource === 'mine' }"
        type="button"
        role="tab"
        :aria-selected="activeSource === 'mine'"
        @click="activeSource = 'mine'"
      >
        我的
      </button>
      <button
        class="hot-sidebar__tab"
        :class="{ 'is-active': activeSource === 'default' }"
        type="button"
        role="tab"
        :aria-selected="activeSource === 'default'"
        @click="activeSource = 'default'"
      >
        热搜
      </button>
    </div>

    <div class="hot-sidebar__list-wrap">
      <ul class="hot-list">
        <li v-for="item in currentList" :key="`${activeSource}-${item.rank}-${item.word}`" class="hot-list__item">
          <span class="hot-list__rank" :class="{ 'is-top3': item.rank <= 3 }">{{ item.rank }}</span>
          <a
            class="hot-list__link"
            :href="buildWeiboSearchUrl(item.word)"
            :title="item.word"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="hot-list__word">{{ item.word }}</span>
            <span class="hot-list__desc" :style="{ color: item.color || 'var(--hot-color-desc)' }">{{
              item.desc
            }}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
body:has([state='noside']) aside {
  display: none;
}
aside {
  position: fixed;
  top: 68px;
  left: calc(50vw + 274px);
  z-index: 9999;
}
.hot-sidebar {
  --hot-color-bg: #fff;
  --hot-color-border: #eceef2;
  --hot-color-title: #1f2d3d;
  --hot-color-text: #1f2d3d;
  --hot-color-desc: #8b97a6;
  --hot-color-muted: #9aa4b2;
  --hot-color-tab-bg: #f3f4f6;
  --hot-color-tab-active-bg: #fff;
  --hot-color-tab-text: #8c98a7;
  --hot-color-tab-active-text: #1f2d3d;
  --hot-color-rank: #ff8200;
  --hot-color-rank-top3: #f26d5f;

  width: 282px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: var(--hot-color-bg);
  border: 1px solid var(--hot-color-border);
  border-radius: 4px;
  overflow: hidden;
}

.hot-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}

.hot-sidebar__title {
  margin: 0;
  font-size: 16px;
  color: var(--hot-color-title);
  font-weight: 500;
}

.hot-sidebar__refresh {
  border: none;
  background: transparent;
  color: var(--hot-color-muted);
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }
}

.hot-sidebar__refresh-icon {
  font-size: 14px;

  &.is-spinning {
    animation: spin 0.9s linear infinite;
  }
}

.hot-sidebar__tabs {
  margin: 0 16px;
  background: var(--hot-color-tab-bg);
  border-radius: 4px;
  padding: 3px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.hot-sidebar__tab {
  border: none;
  background: transparent;
  color: var(--hot-color-tab-text);
  border-radius: 4px;
  font-size: 13px;
  padding: 2px 0;
  cursor: pointer;

  &.is-active {
    background: var(--hot-color-tab-active-bg);
    color: var(--hot-color-tab-active-text);
  }
}

.hot-sidebar__list-wrap {
  margin-top: 8px;
  padding: 0 10px 12px 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 999px;
  }
}

.hot-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hot-list__item {
  display: flex;
  align-items: center;
  height: 40px;
}

.hot-list__rank {
  display: inline-flex;
  justify-content: center;
  height: 1;
  line-height: 1.2;
  width: 24px;
  flex: 0 0 24px;
  font-size: 18px;
  color: var(--hot-color-rank);
  font-variant-numeric: tabular-nums;
  font-family: var(--vc-font-family);

  &.is-top3 {
    font-weight: 700;
    font-style: italic;
    color: var(--hot-color-rank-top3);
  }
}

.hot-list__link {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  text-decoration: none;

  &:hover .hot-list__word,
  &:hover .hot-list__desc {
    color: var(--hot-color-rank);
  }
}

.hot-list__word {
  display: inline-block;
  flex: 1;
  height: 1;
  line-height: 1.2;
  margin-left: 6px;
  min-width: 0;
  font-size: 14px;
  color: var(--hot-color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-list__desc {
  font-size: 13px;
  font-weight: 600;
  margin-left: 8px;
  height: 1;
  line-height: 1.2;
  color: var(--hot-color-desc);
  white-space: nowrap;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
