import { GM_xmlhttpRequest } from '$'

const DEFAULT_TIMEOUT = 10000
const DEFAULT_ACCEPT = 'application/json, text/plain, */*'
const DEFAULT_REFERER = 'https://weibo.com/'

type RequestHeaders = Record<string, string | undefined>

type GetConfig = {
  headers?: RequestHeaders
}

type ApiResponse<T> = {
  data: T
  headers: Record<string, string>
  status: number
  statusText: string
}

const getHeader = (headers: RequestHeaders | undefined, name: string) => {
  if (!headers) {
    return undefined
  }
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase())
  return entry?.[1]
}

const compactHeaders = (headers: RequestHeaders) => {
  return Object.fromEntries(
    Object.entries(headers).filter(([, value]) => typeof value === 'string' && value.length > 0),
  ) as Record<string, string>
}

const parseResponseHeaders = (raw: string) => {
  const headers: Record<string, string> = {}
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const index = line.indexOf(':')
      if (index <= 0) {
        return
      }
      const key = line.slice(0, index).trim().toLowerCase()
      const value = line.slice(index + 1).trim()
      headers[key] = value
    })
  return headers
}

const buildHeaders = (customHeaders: RequestHeaders | undefined) => {
  const merged: RequestHeaders = {
    Accept: getHeader(customHeaders, 'Accept') ?? DEFAULT_ACCEPT,
    Referer: getHeader(customHeaders, 'Referer') ?? DEFAULT_REFERER,
    ...(customHeaders ?? {}),
  }
  return compactHeaders(merged)
}

const parseJson = <T>(responseText: string, url: string): T => {
  try {
    return JSON.parse(responseText) as T
  } catch {
    throw new Error(`API 返回非 JSON 数据: ${url}`)
  }
}

const requestGet = <T>(url: string, config?: GetConfig) => {
  const headers = buildHeaders(config?.headers)
  const cookie = getHeader(config?.headers, 'Cookie') ?? document.cookie

  return new Promise<ApiResponse<T>>((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      timeout: DEFAULT_TIMEOUT,
      responseType: 'text',
      anonymous: false,
      headers,
      cookie,
      onload: (response) => {
        const parsedHeaders = parseResponseHeaders(response.responseHeaders)
        const contentType = parsedHeaders['content-type']
        if (typeof contentType === 'string' && contentType.includes('text/html')) {
          reject(new Error('API 返回 HTML，可能未登录或无权限'))
          return
        }

        const text = typeof response.responseText === 'string' ? response.responseText : ''
        const data = parseJson<T>(text, url)

        resolve({
          data,
          headers: parsedHeaders,
          status: response.status,
          statusText: response.statusText,
        })
      },
      onerror: () => {
        reject(new Error(`API 请求失败: ${url}`))
      },
      ontimeout: () => {
        reject(new Error(`API 请求超时: ${url}`))
      },
      onabort: () => {
        reject(new Error(`API 请求被中止: ${url}`))
      },
    })
  })
}

export const hotApiClient = {
  get: requestGet,
}
