import { MineHeaders, MineResponse } from '@/types/api'
import { hotApiClient } from './client'

const MINE_BAND_PATH = '/ajax/statuses/mineBand' as const

export const fetchMine = async (headers?: MineHeaders) => {
  const response = await hotApiClient.get<MineResponse>(MINE_BAND_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })

  return response.data
}
