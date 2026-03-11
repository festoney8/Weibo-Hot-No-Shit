import { EntmtHeaders, EntmtResponse } from '@/types/api.ts'
import { hotApiClient } from '../client.ts'
import { assertSuccessPayload } from '../guards.ts'

const ENTERTAINMENT_HOT_PATH = '/ajax/statuses/entertainment' as const

export const fetchEntmt = async (headers?: EntmtHeaders) => {
  const response = await hotApiClient.get<EntmtResponse>(ENTERTAINMENT_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<EntmtResponse>(response.data, ENTERTAINMENT_HOT_PATH)
}
