// @ts-check

import { Editor } from "./editor.mjs"
import { select_or_throw } from "./helpers.mjs"
import { html } from "./render_tools.mjs"
import {
  fragment_regex,
  get_file_id,
  is_line_link,
  line_link_range,
} from "./selectors.mjs"

export class FragmentController {
  /**
   * @param {HTMLElement} header_element
   * @param {HTMLElement} asm_element
   * @param {Editor} editor
   */
  constructor(header_element, asm_element, editor) {
    this.header_element = header_element
    this.asm_element = asm_element
    this.editor = editor
    this.switch_button = select_or_throw("button[js-role='section-switch']")

    this.asm_element.addEventListener("click", this.#handle_click)
    this.switch_button.addEventListener("click", this.#handle_section_switch)

    this.render()
  }

  /**
   *
   * @param {number} file_id
   * @returns
   */
  store_key_of_id = file_id => `asm_${file_id}`

  /**
   *
   * @param {number} file_id
   * @returns {{name: string, asm: string, warnings: any[], errors: any[]} | null}
   */
  get_file = file_id => {
    const item = localStorage.getItem(this.store_key_of_id(file_id))
    return item && JSON.parse(item)
  }

  /**
   *
   * @param {string} raw_header
   * @param {number} i
   * @returns {string}
   */
  #render_header = (raw_header, i) =>
    html`<label id="asm-header-${i}" for="asm-switch-${i}" class="asm__header"
      >${this.#render_line_link(raw_header)}</label
    >`

  /**
   *
   * @param {string} line
   * @returns {string}
   */
  #render_line_link = line =>
    is_line_link(line)
      ? (({ pre, post, beginning, end }) =>
          html`<span class="asm__annotation"
            >${pre}<a
              class="asm__annotation asm__annotation--link"
              js-data-beginning="${beginning}"
              js-data-end="${end}"
              >${beginning}:${end}</a
            >${post}</span
          >`)(line_link_range(line))
      : line

  /**
   *
   * @param {string} raw_asm
   * @param {number} i
   * @returns {string}
   */
  #render_body_asm = (raw_asm, i) =>
    html`<input type="checkbox" id="asm-switch-${i}" class="asm__switch" />
      <p id="asm-body-${i}" class="asm__body">
        ${raw_asm
          .split("\n")
          .map(l =>
            l.startsWith(";") ? `<span class="asm__comment">${l}</span>` : l
          )
          .map(this.#render_line_link)}
      </p>`

  /**
   *
   * @typedef {{
   * beginning: number,
   * end: number,
   * message: string}} Exception
   * @param {Exception[]} errors
   * @param {Exception[]} warnings
   * @returns {string}
   */
  #render_body_exceptions = (errors, warnings) =>
    html`
      ${errors?.length
        ? html`<div class="asm">
            <label
              id="asm-header-errors"
              for="asm-switch-errors"
              class="asm__header"
              >errors:</label
            >
            <input type="checkbox" id="asm-switch-errors" class="asm__switch" />
            <p id="asm-body-errors" class="asm__body">
              ${errors
                .map(
                  e =>
                    html`<span class="asm__error"
                      >file.c:${e.beginning}:${e.end}: ${e.message}</span
                    >`
                )
                .map(this.#render_line_link)}
            </p>
          </div>`
        : ""}
      ${warnings?.length
        ? html`<div class="asm">
            <label
              id="asm-header-warnings"
              for="asm-switch-warnings"
              class="asm__header"
              >warnings:</label
            >
            <input
              type="checkbox"
              id="asm-switch-warnings"
              class="asm__switch"
            />
            <p id="asm-body-warnings" class="asm__body">
              ${warnings
                .map(
                  w =>
                    html`<span class="asm__warning"
                      >file.c:${w.beginning}:${w.end}: ${w.message}</span
                    >`
                )
                .map(this.#render_line_link)}
            </p>
          </div>`
        : ""}
    `

  /**
   *
   * @param {MouseEvent} e
   */
  #handle_click = e => {
    /**
     * @type {HTMLElement | null}
     */
    // @ts-ignore
    const target = e.target
    if (!target || e.eventPhase !== Event.BUBBLING_PHASE) {
      return
    }

    const beginning = +(target.getAttribute("js-data-beginning") ?? "1")
    const end = +(target.getAttribute("js-data-end") ?? "1")

    if (!e.ctrlKey || Number.isNaN(beginning) || Number.isNaN(end)) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    this.editor.scroll_to_line(beginning)
  }

  #handle_section_switch = () => {
    /**
     * @type {HTMLInputElement[]}
     */
    // @ts-ignore
    const switches = [
      ...this.asm_element.querySelectorAll("input[id^='asm-switch']"),
    ]
    const are_any_open = switches.some(s => s.checked ?? false)
    const new_checked = !are_any_open

    switches.forEach(s => (s.checked = new_checked))
  }

  render = () => {
    const file_id = get_file_id()
    if (!file_id) {
      return
    }

    const file = this.get_file(file_id)
    if (!file) {
      return
    }
    const { asm: raw, warnings, errors } = file
    const rendered_exceptions = this.#render_body_exceptions(errors, warnings)

    const rendered = [...(raw ?? "").matchAll(fragment_regex)].reduce(
      (u, m, i) =>
        `${u}<div class="asm">${this.#render_header(
          m[1],
          i
        )}${this.#render_body_asm(m[2], i)}</div>`,
      rendered_exceptions
    )

    this.header_element.textContent = "ASM output"
    this.asm_element.innerHTML = rendered
  }
}
