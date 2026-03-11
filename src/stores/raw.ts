import type { Pinia } from 'pinia'
import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { fetchDefault, fetchEntmt, fetchLife, fetchMine, fetchSocial } from '@/api'
import { ApiResponseError } from '@/api/guards'
import type { DefaultResponse, EntmtResponse, LifeResponse, MineResponse, SocialResponse } from '@/types/api'
import { logger } from '@/utils/logger'
import { updateEntmtWordHistory, updateLifeWordHistory } from './history'

const RAW_TTL_MS = 3 * 60 * 1000 // TTL 3 minutes

type RawState<T> = {
  data: T | null
  updatedAt: number
}

type RawStoreInstance<T> = {
  state: Ref<RawState<T>>
  loading: Ref<boolean>
  error: Ref<Error | null>
  ensureFresh: (force?: boolean) => Promise<T | null>
  refresh: () => Promise<T | null>
}

type CreateRawStoreOptions<T> = {
  id: string
  storageKey: string
  sourceLabel: string
  fetcher: () => Promise<T>
  unknownErrorMessage: string
  onSuccess?: (response: T) => void
}

const createInitialState = <T>() => {
  return {
    data: null,
    updatedAt: 0,
  } as RawState<T>
}

const createRawStore = <T>(options: CreateRawStoreOptions<T>) => {
  return defineStore(options.id, (): RawStoreInstance<T> => {
    const state = useStorage<RawState<T>>(options.storageKey, createInitialState<T>(), localStorage)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const ensureFresh = async (force = false) => {
      if (!force && state.value.data && Date.now() - state.value.updatedAt < RAW_TTL_MS) {
        logger.info(`${options.sourceLabel} API cache hit. Returning cached data.`)
        return state.value.data
      }

      loading.value = true
      error.value = null
      try {
        const response = await options.fetcher()
        state.value = {
          data: response,
          updatedAt: Date.now(),
        }
        options.onSuccess?.(response)
        return response
      } catch (cause) {
        const currentError = cause instanceof Error ? cause : new Error(options.unknownErrorMessage)
        error.value = currentError

        if (cause instanceof ApiResponseError) {
          logger.warn(`${options.sourceLabel} API response invalid:`, cause.endpoint, cause.payload)
        } else {
          logger.error(`${options.sourceLabel} API request failed:`, cause)
        }

        if (state.value.data) {
          logger.warn(`${options.sourceLabel} API failed, keep stale cache`)
          return state.value.data
        }

        throw currentError
      } finally {
        loading.value = false
        logger.info(`${options.sourceLabel} API fetch finished. Success: ${!error.value}, Force: ${force}`)
      }
    }

    const refresh = async () => ensureFresh(true)

    return {
      state,
      loading,
      error,
      ensureFresh,
      refresh,
    }
  })
}

export const useMineRawStore = createRawStore<MineResponse>({
  id: 'raw-mine',
  storageKey: 'weibo-hot-no-shit:raw:mine',
  sourceLabel: 'Mine',
  fetcher: fetchMine,
  unknownErrorMessage: 'Unknown error while fetching mine hot list',
})

export const useDefaultRawStore = createRawStore<DefaultResponse>({
  id: 'raw-default',
  storageKey: 'weibo-hot-no-shit:raw:default',
  sourceLabel: 'Default',
  fetcher: fetchDefault,
  unknownErrorMessage: 'Unknown error while fetching default hot list',
})

export const useEntmtRawStore = createRawStore<EntmtResponse>({
  id: 'raw-entmt',
  storageKey: 'weibo-hot-no-shit:raw:entmt',
  sourceLabel: 'Entertainment',
  fetcher: fetchEntmt,
  unknownErrorMessage: 'Unknown error while fetching entertainment hot list',
  onSuccess: updateEntmtWordHistory,
})

export const useLifeRawStore = createRawStore<LifeResponse>({
  id: 'raw-life',
  storageKey: 'weibo-hot-no-shit:raw:life',
  sourceLabel: 'Life',
  fetcher: fetchLife,
  unknownErrorMessage: 'Unknown error while fetching life hot list',
  onSuccess: updateLifeWordHistory,
})

export const useSocialRawStore = createRawStore<SocialResponse>({
  id: 'raw-social',
  storageKey: 'weibo-hot-no-shit:raw:social',
  sourceLabel: 'Social',
  fetcher: fetchSocial,
  unknownErrorMessage: 'Unknown error while fetching social hot list',
})

export const ensureAllRawStoresFresh = async (pinia: Pinia, force = false) => {
  const mine = useMineRawStore(pinia)
  const defaultStore = useDefaultRawStore(pinia)
  const entmt = useEntmtRawStore(pinia)
  const life = useLifeRawStore(pinia)
  const social = useSocialRawStore(pinia)

  const results = await Promise.allSettled([
    mine.ensureFresh(force),
    defaultStore.ensureFresh(force),
    entmt.ensureFresh(force),
    life.ensureFresh(force),
    social.ensureFresh(force),
  ])

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const source = ['mine', 'default', 'entmt', 'life', 'social'][index]
      logger.warn(`Raw prefetch failed for ${source}:`, result.reason)
    }
  })
}
