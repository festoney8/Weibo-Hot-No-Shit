import { EntmtHeaders, EntmtResponse } from '@/types/api'
import { hotApiClient } from './client'
import { assertSuccessPayload } from './guards'

const ENTERTAINMENT_HOT_PATH = '/ajax/statuses/entertainment' as const

export const fetchEntmt = async (headers?: EntmtHeaders) => {
  const response = await hotApiClient.get<EntmtResponse>(ENTERTAINMENT_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<EntmtResponse>(response.data, ENTERTAINMENT_HOT_PATH)
}
