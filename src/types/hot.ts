export type HotSource = 'mine' | 'default' | 'entertainment' | 'life' | 'social'

export interface NormalizedHotItem {
  source: HotSource
  word: string
  wordScheme: string
  note: string
  rank?: number
  heat?: number
  iconDesc?: string
  iconDescColor?: string
  topicFlag?: number
  isAd?: boolean
}
