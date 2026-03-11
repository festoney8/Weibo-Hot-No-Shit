import { SocialHeaders, SocialResponse } from '@/types/api'
import { hotApiClient } from './client'
import { assertSuccessPayload } from './guards'

const SOCIAL_HOT_PATH = '/ajax/statuses/social' as const

export const fetchSocial = async (headers?: SocialHeaders) => {
  const response = await hotApiClient.get<SocialResponse>(SOCIAL_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<SocialResponse>(response.data, SOCIAL_HOT_PATH)
}
