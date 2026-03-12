<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { useFilteredDefaultHotSearch } from '@/composables/defaultHot'
import { useFilteredMineHotSearch } from '@/composables/mineHot'
import { useMineRawStore, useDefaultRawStore } from '@/stores/raw'
import { logger } from '@/utils/logger'

const REFRESH_COOLDOWN_MS = 30000

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

const refreshCooldownUntil = ref(0)
const hasManualRefreshed = ref(false)
const nowTs = ref(Date.now())
const refreshIconKey = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const ensureCooldownTicker = () => {
  if (cooldownTimer) {
    return
  }
  cooldownTimer = setInterval(() => {
    nowTs.value = Date.now()
    if (nowTs.value >= refreshCooldownUntil.value && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

const cooldownRemainingSec = computed(() => {
  const remainMs = refreshCooldownUntil.value - nowTs.value
  return remainMs > 0 ? Math.ceil(remainMs / 1000) : 0
})

const isInCooldown = computed(() => cooldownRemainingSec.value > 0)

const canRefresh = computed(() => {
  if (isRefreshing.value) {
    return false
  }
  if (!hasManualRefreshed.value) {
    return true
  }
  return !isInCooldown.value
})

const startRefreshCooldown = () => {
  refreshCooldownUntil.value = Date.now() + REFRESH_COOLDOWN_MS
  nowTs.value = Date.now()
  ensureCooldownTicker()
}

const doRefreshCurrent = async () => {
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

const throttledRefresh = useThrottleFn(
  async () => {
    startRefreshCooldown()
    await doRefreshCurrent()
  },
  REFRESH_COOLDOWN_MS,
  true,
  false,
)

const refreshCurrent = async () => {
  refreshIconKey.value += 1

  if (!canRefresh.value) {
    return
  }

  if (!hasManualRefreshed.value) {
    hasManualRefreshed.value = true
    startRefreshCooldown()
    await doRefreshCurrent()
    return
  }

  await throttledRefresh()
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
        <RefreshSolid :class="['hot-sidebar__refresh-icon', { 'is-spinning': isRefreshing }]" :key="refreshIconKey" />
        <span>{{ '点击刷新' }}</span>
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
  width: 14px;
  height: 14px;
  font-size: 14px;
  animation: spin-click 0.45s linear;
  color: #939393;

  &.is-spinning {
    animation: spin 0.9s linear infinite;
  }
}

@keyframes spin-click {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
  height: 2em;

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
