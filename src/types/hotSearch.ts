export type HotSource = 'mine' | 'default' | 'entertainment' | 'life' | 'social'

export interface HotSearch {
  rank: number
  word: string
  desc: string | number
  color: string
}
