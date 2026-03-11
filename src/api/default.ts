import { DefaultHeaders, DefaultResponse } from '@/types/api'
import { hotApiClient } from './client'
import { assertSuccessPayload } from './guards'
const DEFAULT_HOT_SEARCH_PATH = '/ajax/side/hotSearch' as const

export const fetchDefault = async (headers?: DefaultHeaders) => {
  const response = await hotApiClient.get<DefaultResponse>(DEFAULT_HOT_SEARCH_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<DefaultResponse>(response.data, DEFAULT_HOT_SEARCH_PATH)
}
