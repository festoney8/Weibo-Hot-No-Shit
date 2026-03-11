import { SocialHeaders, SocialResponse } from '@/types/api'
import { hotApiClient } from './client'

const SOCIAL_HOT_PATH = '/ajax/statuses/social' as const

export const fetchSocial = async (headers?: SocialHeaders) => {
  const response = await hotApiClient.get<SocialResponse>(SOCIAL_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })

  return response.data
}
