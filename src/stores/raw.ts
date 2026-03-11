import { defineStore } from 'pinia'
import type { Pinia } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { fetchDefault, fetchEntmt, fetchLife, fetchMine, fetchSocial } from '@/api'
import type { DefaultResponse, EntmtResponse, LifeResponse, MineResponse, SocialResponse } from '@/types/api'

const RAW_TTL_MS = 5 * 60 * 1000

type RawState<T> = {
  data: T | null
  updatedAt: number
}

const createInitialState = <T>() => {
  return {
    data: null,
    updatedAt: 0,
  } as RawState<T>
}

const isExpired = (updatedAt: number, ttlMs: number) => {
  if (updatedAt <= 0) {
    return true
  }

  return Date.now() - updatedAt > ttlMs
}

export const useMineRawStore = defineStore('raw-mine', () => {
  const state = useStorage<RawState<MineResponse>>(
    'weibo-hot-no-shit:raw:mine',
    createInitialState<MineResponse>(),
    localStorage,
  )
  const loading = ref(false)

  const ensureFresh = async (force = false) => {
    if (!force && state.value.data && !isExpired(state.value.updatedAt, RAW_TTL_MS)) {
      return state.value.data
    }

    loading.value = true
    try {
      const response = await fetchMine()
      state.value = {
        data: response,
        updatedAt: Date.now(),
      }
      return response
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => ensureFresh(true)

  return {
    state,
    loading,
    ensureFresh,
    refresh,
  }
})

export const useDefaultRawStore = defineStore('raw-default', () => {
  const state = useStorage<RawState<DefaultResponse>>(
    'weibo-hot-no-shit:raw:default',
    createInitialState<DefaultResponse>(),
    localStorage,
  )
  const loading = ref(false)

  const ensureFresh = async (force = false) => {
    if (!force && state.value.data && !isExpired(state.value.updatedAt, RAW_TTL_MS)) {
      return state.value.data
    }

    loading.value = true
    try {
      const response = await fetchDefault()
      state.value = {
        data: response,
        updatedAt: Date.now(),
      }
      return response
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => ensureFresh(true)

  return {
    state,
    loading,
    ensureFresh,
    refresh,
  }
})

export const useEntmtRawStore = defineStore('raw-entmt', () => {
  const state = useStorage<RawState<EntmtResponse>>(
    'weibo-hot-no-shit:raw:entmt',
    createInitialState<EntmtResponse>(),
    localStorage,
  )
  const loading = ref(false)

  const ensureFresh = async (force = false) => {
    if (!force && state.value.data && !isExpired(state.value.updatedAt, RAW_TTL_MS)) {
      return state.value.data
    }

    loading.value = true
    try {
      const response = await fetchEntmt()
      state.value = {
        data: response,
        updatedAt: Date.now(),
      }
      return response
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => ensureFresh(true)

  return {
    state,
    loading,
    ensureFresh,
    refresh,
  }
})

export const useLifeRawStore = defineStore('raw-life', () => {
  const state = useStorage<RawState<LifeResponse>>(
    'weibo-hot-no-shit:raw:life',
    createInitialState<LifeResponse>(),
    localStorage,
  )
  const loading = ref(false)

  const ensureFresh = async (force = false) => {
    if (!force && state.value.data && !isExpired(state.value.updatedAt, RAW_TTL_MS)) {
      return state.value.data
    }

    loading.value = true
    try {
      const response = await fetchLife()
      state.value = {
        data: response,
        updatedAt: Date.now(),
      }
      return response
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => ensureFresh(true)

  return {
    state,
    loading,
    ensureFresh,
    refresh,
  }
})

export const useSocialRawStore = defineStore('raw-social', () => {
  const state = useStorage<RawState<SocialResponse>>(
    'weibo-hot-no-shit:raw:social',
    createInitialState<SocialResponse>(),
    localStorage,
  )
  const loading = ref(false)

  const ensureFresh = async (force = false) => {
    if (!force && state.value.data && !isExpired(state.value.updatedAt, RAW_TTL_MS)) {
      return state.value.data
    }

    loading.value = true
    try {
      const response = await fetchSocial()
      state.value = {
        data: response,
        updatedAt: Date.now(),
      }
      return response
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => ensureFresh(true)

  return {
    state,
    loading,
    ensureFresh,
    refresh,
  }
})

export const ensureAllRawStoresFresh = async (pinia: Pinia, force = false) => {
  const mine = useMineRawStore(pinia)
  const defaultStore = useDefaultRawStore(pinia)
  const entmt = useEntmtRawStore(pinia)
  const life = useLifeRawStore(pinia)
  const social = useSocialRawStore(pinia)

  await Promise.all([
    mine.ensureFresh(force),
    defaultStore.ensureFresh(force),
    entmt.ensureFresh(force),
    life.ensureFresh(force),
    social.ensureFresh(force),
  ])
}
