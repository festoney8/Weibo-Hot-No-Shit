import axios from 'axios'

export const hotApiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
})
