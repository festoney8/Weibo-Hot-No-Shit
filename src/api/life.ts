import { LifeHeaders, LifeResponse } from '@/types/api'
import { hotApiClient } from './client'
import { assertSuccessPayload } from './guards'

const LIFE_HOT_PATH = '/ajax/statuses/life' as const

export const fetchLife = async (headers?: LifeHeaders) => {
  const response = await hotApiClient.get<LifeResponse>(LIFE_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<LifeResponse>(response.data, LIFE_HOT_PATH)
}
