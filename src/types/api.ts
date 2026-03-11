import type { components, paths } from './schema'

export type MineHeaders = paths['/ajax/statuses/mineBand']['get']['parameters']['header']
export type DefaultHeaders = paths['/ajax/side/hotSearch']['get']['parameters']['header']
export type EntmtHeaders = paths['/ajax/statuses/entertainment']['get']['parameters']['header']
export type LifeHeaders = paths['/ajax/statuses/life']['get']['parameters']['header']
export type SocialHeaders = paths['/ajax/statuses/social']['get']['parameters']['header']

export type MineResponse = paths['/ajax/statuses/mineBand']['get']['responses'][200]['content']['application/json']
export type DefaultResponse = paths['/ajax/side/hotSearch']['get']['responses'][200]['content']['application/json']
export type EntmtResponse =
  paths['/ajax/statuses/entertainment']['get']['responses'][200]['content']['application/json']
export type LifeResponse = paths['/ajax/statuses/life']['get']['responses'][200]['content']['application/json']
export type SocialResponse = paths['/ajax/statuses/social']['get']['responses'][200]['content']['application/json']

export type MineItem = components['schemas']['my_band']
export type DefaultItem = components['schemas']['default_band']
export type EntmtItem = components['schemas']['entmt_band']
export type LifeItem = components['schemas']['life_band']
export type SocialItem = components['schemas']['social_band']
