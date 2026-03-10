export const waitForHead = () => {
  return new Promise<void>((resolve) => {
    if (document.head) {
      resolve()
      return
    }
    const observer = new MutationObserver(() => {
      if (document.head) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })
}

export const waitForBody = () => {
  return new Promise<void>((resolve) => {
    if (document.body) {
      resolve()
      return
    }
    const observer = new MutationObserver(() => {
      if (document.body) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })
}
