import { LifeHeaders, LifeResponse } from '@/types/api.ts'
import { hotApiClient } from '../client.ts'
import { assertSuccessPayload } from '../guards.ts'

const LIFE_HOT_PATH = '/ajax/statuses/life' as const

export const fetchLife = async (headers?: LifeHeaders) => {
  const response = await hotApiClient.get<LifeResponse>(LIFE_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<LifeResponse>(response.data, LIFE_HOT_PATH)
}
