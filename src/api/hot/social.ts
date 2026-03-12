import { SocialHeaders, SocialResponse } from '@/types/api.ts'
import { hotApiClient } from '../client.ts'
import { assertSuccessPayload } from '../guards.ts'

const SOCIAL_HOT_PATH = 'https://weibo.com/ajax/statuses/social' as const

export const fetchSocial = async (headers?: SocialHeaders) => {
  const response = await hotApiClient.get<SocialResponse>(SOCIAL_HOT_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<SocialResponse>(response.data, SOCIAL_HOT_PATH)
}
