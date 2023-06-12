//@ts-check

export const RouterStateType = Object.seal({
  file_change: "FILE_CHANGE",
  any: "*",
})

/**
 * @typedef {{
 * path: string,
 * payload: Object<string, any> | null
 * type: string,
 * }} RouterState
 *
 * @typedef {(state: RouterState) => any} RouterHook
 */

export class Router {
  /**
   * @type {RouterHook[]}
   */
  #hooks = []

  constructor() {
    document.addEventListener("click", this.#handle_link_click)
    window.addEventListener("popstate", this.#handle_popstate)
    // @ts-ignore
    window.addEventListener("pushstate", this.#handle_push_state)
  }

  /**
   * @param {RouterHook} _hook
   * @returns {this}
   */
  hook = _hook => (this.#hooks.push(_hook), this)

  /**
   * @param {PopStateEvent} e
   */
  #handle_popstate = e => {
    e.preventDefault()
    this.on_change(e.state)
  }

  /**
   * @param {RouterState} state
   */
  on_change = state => this.#hooks.forEach(hook => hook(state))

  /**
   * @param {CustomEvent<RouterState>} e
   */
  #handle_push_state = e => {
    const state = e.detail
    if (history.state?.path === state.path) {
      return
    }
    history.pushState(state, "", `#${state.path}`)
    this.on_change(state)
  }

  /**
   * @param {MouseEvent} e
   */
  #handle_link_click = e => {
    /**
     * @type {HTMLAnchorElement | null}
     */
    // @ts-ignore
    const target = e.target
    if (target?.tagName !== "A" || !target?.hasAttribute("js-data-type")) {
      return
    }

    e.preventDefault()

    const type = target.getAttribute("js-data-type") ?? RouterStateType.any
    const raw_payload = target.getAttribute("js-data-payload")
    const payload = { id: +(raw_payload ?? "-1") }

    Router.push_state({
      path: target.getAttribute("href") ?? target.href,
      type,
      payload,
    })
  }

  /**
   *
   * @param {RouterState} detail
   * @returns {boolean}
   */
  static push_state = detail =>
    window.dispatchEvent(
      new CustomEvent("pushstate", {
        bubbles: false,
        cancelable: false,
        detail,
      })
    )
}
