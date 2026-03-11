/* eslint-disable @typescript-eslint/no-explicit-any */
const PROJECT_NAME = '[Weibo-Hot-No-Shit]'
const time = () => performance.now().toFixed(2)

export const logger = {
  log(...args: any[]) {
    console.log(PROJECT_NAME, time() + 'ms', ...args)
  },
  error(...args: any[]) {
    console.error(PROJECT_NAME, time() + 'ms', ...args)
  },
  warn(...args: any[]) {
    console.warn(PROJECT_NAME, time() + 'ms', ...args)
  },
  info(...args: any[]) {
    console.info(PROJECT_NAME, time() + 'ms', ...args)
  },
  debug(...args: any[]) {
    console.debug(PROJECT_NAME, time() + 'ms', ...args)
  },
}
