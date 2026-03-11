import { MineHeaders, MineResponse } from '@/types/api'
import { hotApiClient } from './client'
import { assertSuccessPayload } from './guards'

const MINE_BAND_PATH = '/ajax/statuses/mineBand' as const

export const fetchMine = async (headers?: MineHeaders) => {
  const response = await hotApiClient.get<MineResponse>(MINE_BAND_PATH, {
    headers: {
      ...(headers ?? {}),
    },
  })
  return assertSuccessPayload<MineResponse>(response.data, MINE_BAND_PATH)
}
