import axios from 'axios'

export const hotApiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
  responseType: 'json',
})

hotApiClient.interceptors.response.use((response) => {
  const contentType = response.headers['content-type']
  if (typeof contentType === 'string' && contentType.includes('text/html')) {
    throw new Error('API 返回 HTML，可能未登录或无权限')
  }
  return response
})
