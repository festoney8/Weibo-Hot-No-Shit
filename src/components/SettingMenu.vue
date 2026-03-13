<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { usePluginSettingsStore } from '@/stores/settings'

type SettingsTabKey = 'keywords' | 'names'

const settingsStore = usePluginSettingsStore()
const { keywords, names } = storeToRefs(settingsStore)

const activeTab = ref<SettingsTabKey>('keywords')
const keywordsDraft = ref('')
const namesDraft = ref('')
const currentEditingTab = ref<SettingsTabKey | null>(null)

const toMultiline = (items: string[]) => items.join('\n')

watch(
  keywords,
  (value) => {
    if (currentEditingTab.value === 'keywords') {
      return
    }
    keywordsDraft.value = toMultiline(value)
  },
  { immediate: true },
)

watch(
  names,
  (value) => {
    if (currentEditingTab.value === 'names') {
      return
    }
    namesDraft.value = toMultiline(value)
  },
  { immediate: true },
)

const parseLines = (value: string) => {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

const currentDraft = computed({
  get: () => {
    return activeTab.value === 'keywords' ? keywordsDraft.value : namesDraft.value
  },
  set: (value: string) => {
    if (activeTab.value === 'keywords') {
      keywordsDraft.value = value
      return
    }
    namesDraft.value = value
  },
})

const currentPlaceholder = computed(() => {
  return activeTab.value === 'keywords' ? '每行一个关键词，支持正则（无需flag），如：/abc|\\d+/' : '每行一个人名'
})

const startEditing = () => {
  currentEditingTab.value = activeTab.value
}

const stopEditing = () => {
  currentEditingTab.value = null
}

const syncDraftToStore = () => {
  settingsStore.setKeywords(parseLines(keywordsDraft.value))
  settingsStore.setNames(parseLines(namesDraft.value))
}

watch([keywordsDraft, namesDraft], syncDraftToStore)
</script>

<template>
  <section class="setting-menu" aria-label="过滤设置">
    <nav class="setting-menu__tabs" aria-label="过滤类型">
      <button
        class="setting-menu__tab"
        :class="{ 'is-active': activeTab === 'keywords' }"
        type="button"
        role="tab"
        :aria-selected="activeTab === 'keywords'"
        @click="activeTab = 'keywords'"
      >
        关键词列表
      </button>
      <button
        class="setting-menu__tab"
        :class="{ 'is-active': activeTab === 'names' }"
        type="button"
        role="tab"
        :aria-selected="activeTab === 'names'"
        @click="activeTab = 'names'"
      >
        人名列表
      </button>
    </nav>

    <div class="setting-menu__editor">
      <header class="setting-menu__meta">
        <h3 class="setting-menu__title">{{ activeTab === 'keywords' ? '关键词列表' : '人名列表' }}</h3>
      </header>

      <textarea
        v-model="currentDraft"
        class="setting-menu__textarea"
        :placeholder="currentPlaceholder"
        rows="16"
        spellcheck="false"
        @focus="startEditing"
        @blur="stopEditing"
        @cancel.prevent
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.setting-menu {
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 6px;
  min-width: 620px;
}

.setting-menu__tabs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 8px;
  border-right: 1px solid #eceef2;
}

.setting-menu__tab {
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #5c6570;
  font-size: 13px;
  text-align: left;
  padding: 8px 10px;
  cursor: pointer;

  &.is-active {
    background: #f6f8fc;
    border-color: #d9dee7;
    color: #1f2d3d;
    font-weight: 600;
  }
}

.setting-menu__editor {
  min-width: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.setting-menu__meta {
  align-items: baseline;
  margin-bottom: 8px;
}

.setting-menu__title {
  margin: 0;
  font-size: 14px;
  color: #1f2d3d;
}

.setting-menu__textarea {
  flex: 1;
  resize: none;
  border: 1px solid #d7dce5;
  border-radius: 4px;
  padding: 8px;
  line-height: 1.5;
  font-size: 14px;
  color: #1f2d3d;
  min-height: 280px;
  outline: none;

  &:focus {
    border-color: #8aa4ff;
    box-shadow: 0 0 0 2px rgba(99, 125, 255, 0.15);
  }
}
</style>
