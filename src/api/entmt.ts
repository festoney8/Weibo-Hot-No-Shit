import { EntmtHeaders, EntmtResponse } from '@/types/api'
import { hotApiClient } from './client'

const ENTERTAINMENT_HOT_PATH = '/ajax/statuses/entertainment' as const

export const fetchEntmt = async (headers?: EntmtHeaders) => {
  const response = await hotApiClient.get<EntmtResponse>(ENTERTAINMENT_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })

  return response.data
}
