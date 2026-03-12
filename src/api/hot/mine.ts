import { MineHeaders, MineResponse } from '@/types/api.ts'
import { hotApiClient } from '../client.ts'
import { assertSuccessPayload } from '../guards.ts'

const MINE_BAND_PATH = 'https://weibo.com/ajax/statuses/mineBand' as const

export const fetchMine = async (headers?: MineHeaders) => {
  const response = await hotApiClient.get<MineResponse>(MINE_BAND_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<MineResponse>(response.data, MINE_BAND_PATH)
}
