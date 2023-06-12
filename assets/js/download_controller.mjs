// @ts-check

import { FragmentController } from "./fragment_controller.mjs"
import { get_file_id } from "./selectors.mjs"

export class DownloadController {
  /**
   *
   * @param {HTMLElement} button
   * @param {FragmentController} fragment_controller
   */
  constructor(button, fragment_controller) {
    button.addEventListener("click", e => {
      e.preventDefault()

      const a = document.createElement("a")
      const file_id = get_file_id()
      if (file_id === null) {
        return
      }

      const file = fragment_controller.get_file(file_id)
      if (!file) {
        return
      }

      a.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(file.asm)
      )
      a.setAttribute("download", file.name.replace(/\.c$/, ".asm"))
      a.style.display = "none"

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
  }
}
