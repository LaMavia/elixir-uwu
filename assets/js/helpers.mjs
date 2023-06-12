/**
 * @param {string} selector
 * @param {HTMLElement | Document} root
 * @returns {T extends HTMLElement ? T : never}
 */
export const select_or_throw = (selector, root = document) => {
  const element = root.querySelector(selector)
  if (element === null) {
    throw new Error(`Failed to find selector '${selector}'`)
  }

  // @ts-ignore
  return element
}
