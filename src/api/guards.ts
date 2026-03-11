type UnknownObject = Record<string, unknown>

const isObject = (value: unknown): value is UnknownObject => {
  return typeof value === 'object' && value !== null
}

const getOkValue = (payload: unknown) => {
  if (!isObject(payload)) {
    return undefined
  }
  const ok = payload.ok
  return typeof ok === 'number' ? ok : undefined
}

const hasDataField = (payload: unknown) => {
  if (!isObject(payload)) {
    return false
  }
  return 'data' in payload
}

export class ApiResponseError extends Error {
  constructor(
    message: string,
    public readonly endpoint: string,
    public readonly payload?: unknown,
  ) {
    super(message)
    this.name = 'ApiResponseError'
  }
}

export const assertSuccessPayload = <T extends UnknownObject>(payload: unknown, endpoint: string) => {
  if (!isObject(payload)) {
    throw new ApiResponseError('API 返回非 JSON 对象', endpoint, payload)
  }
  const ok = getOkValue(payload)
  if (ok !== 1) {
    throw new ApiResponseError(`API 返回失败状态 ok=${String(ok)}`, endpoint, payload)
  }
  if (!hasDataField(payload)) {
    throw new ApiResponseError('API 成功响应缺少 data 字段', endpoint, payload)
  }
  return payload as T
}
