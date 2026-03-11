/* eslint-disable @typescript-eslint/no-explicit-any */
const PROJECT_NAME = '[Weibo-Hot-No-Shit]'

export const logger = {
  log(...args: any[]) {
    console.log(PROJECT_NAME, ...args)
  },
  error(...args: any[]) {
    console.error(PROJECT_NAME, ...args)
  },
  warn(...args: any[]) {
    console.warn(PROJECT_NAME, ...args)
  },
  info(...args: any[]) {
    console.info(PROJECT_NAME, ...args)
  },
  debug(...args: any[]) {
    console.debug(PROJECT_NAME, ...args)
  },
}
