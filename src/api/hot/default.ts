import { DefaultHeaders, DefaultResponse } from '@/types/api.ts'
import { hotApiClient } from '../client.ts'
import { assertSuccessPayload } from '../guards.ts'
const DEFAULT_HOT_SEARCH_PATH = 'https://weibo.com/ajax/side/hotSearch' as const

export const fetchDefault = async (headers?: DefaultHeaders) => {
  const response = await hotApiClient.get<DefaultResponse>(DEFAULT_HOT_SEARCH_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<DefaultResponse>(response.data, DEFAULT_HOT_SEARCH_PATH)
}
