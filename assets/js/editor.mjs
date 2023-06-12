// @ts-check

import { select_or_throw } from "./helpers.mjs"
import { html } from "./render_tools.mjs"
import { Router, RouterStateType } from "./router.mjs"
import { get_file_id } from "./selectors.mjs"

export class Editor {
  /**
   *
   * @param {string} selector
   * @param {string} contents
   * @param {HTMLElement} save_button
   */
  constructor(selector = "#app", contents = "", save_button) {
    this.root = select_or_throw(selector)
    this.root.innerHTML = `
        <div class="line-numbers" js-role="line-numbers"></div>
        <textarea class="code__textarea" js-role="input" spellcheck="false">${contents}</textarea>
    `
    /**
     * @type {HTMLTextAreaElement}
     */
    // @ts-ignore
    this.textarea = select_or_throw("[js-role='input']")
    this.line_numbers = select_or_throw("[js-role='line-numbers']")
    /**
     * @type {HTMLDialogElement}
     */
    // @ts-ignore
    this.section_delete_dialog = select_or_throw("[js-role='section_crud']")
    /**
     * @type {HTMLDialogElement}
     */
    // @ts-ignore
    this.section_add_dialog = select_or_throw("[js-role='section_add']")

    this.textarea.addEventListener("keyup", e => {
      this.update(this.textarea.value, this.sections)
    })
    this.textarea.addEventListener(
      "change",
      e => (this.contents = this.textarea.value)
    )
    this.contents = contents
    /**
     * @type {{
     * name: string,
     * description: string | null,
     * creation_date: string,
     * beginning: number,
     * end: number,
     * kind: string,
     * status: string | null,
     * status_details: string | null,
     * contents: string,
     * id: number}[]}
     */
    this.sections = []
    this.active_section

    this.line_numbers?.addEventListener("click", this.#handle_section_click)
    this.section_delete_dialog
      ?.querySelector("[js-role='section_close']")
      ?.addEventListener("click", () => this.section_delete_dialog?.close())

    this.section_delete_dialog
      ?.querySelector("form")
      ?.addEventListener("submit", e => {
        e.preventDefault()
        this.#handle_section_delete()
      })

    this.section_add_dialog
      ?.querySelector("[js-role='section_close']")
      ?.addEventListener("click", () => this.section_add_dialog?.close())

    this.section_add_dialog
      .querySelector("form")
      ?.addEventListener("submit", e => {
        e.preventDefault()
        this.#handle_section_add()
      })

    this.save_button = save_button
    this.save_button.addEventListener("click", this.#handle_save)

    this.textarea.addEventListener("keyup", this.#handle_input_keyboard)
    this.render()
  }

  update(new_contents = "", new_sections = []) {
    this.contents = new_contents
    this.sections = new_sections
    this.render()
  }

  /**
   *
   * @param {string} type
   */
  #color_of_type = type => {
    switch (type) {
      case "PR":
        return "#4287f5"
      case "CT":
        return "#9c9c9c"
      case "PD":
        return "#5febf5"
      case "VD":
        return "#7e98ed"
      case "IA":
        return "#ed7ee7"
    }
  }

  /**
   *
   * @param {number} file_id
   */
  fetch_file = file_id =>
    fetch(`/file/${file_id}/get/`, {
      method: "POST",
    })
      .then(r => r.json())
      .then(r => {
        if (r.ok) {
          this.update(r.data.contents, r.data.sections)
        } else {
          throw r.error
        }
      })
      .catch(e => (alert(e), console.error(e)))

  #handle_save = () =>
    fetch(`/file/${get_file_id()}/save/`, {
      method: "POST",
      body: JSON.stringify({
        contents: this.contents,
      }),
    })
      .then(r => r.json())
      .then(r => {
        if (!r.ok) {
          throw new Error(r.error)
        }
      })
      .then(() => this.fetch_file(get_file_id()))
      .catch(alert)

  /**
   *
   * @param {MouseEvent} e
   */
  #handle_section_click = e => {
    if (e.eventPhase != Event.BUBBLING_PHASE) {
      return
    }

    /**
     * @type {HTMLElement | null}
     */
    // @ts-ignore
    const target = e.target
    /**
     * @type {HTMLElement | null}
     */
    // @ts-ignore
    const current = target.parentElement
    const id =
      current?.getAttribute("js-data-id") ?? target?.getAttribute("js-data-id")
    const name =
      current?.getAttribute("js-data-name") ??
      target?.getAttribute("js-data-name")

    if (id === null || name === null || name === undefined) {
      return
    }

    this.active_section = id
    this.#show_section_delete_dialog(name)
  }

  /**
   *
   * @param {string} name
   */
  #show_section_delete_dialog = name => {
    select_or_throw(
      "[js-role='section-name']",
      this.section_delete_dialog
    ).textContent = name
    this.section_delete_dialog.showModal()
  }

  #handle_section_delete = () =>
    fetch(`/section/${this.active_section}/delete/`, {
      method: "POST",
    })
      .then(r => r.json())
      .then(r => {
        if (!r.ok) {
          throw new Error(r.error)
        }
      })
      .then(() => this.fetch_file(get_file_id()))
      .catch(alert)
      .finally(() => this.section_delete_dialog.close())

  /**
   *
   * @param {KeyboardEvent} e
   */
  #handle_input_keyboard = e => {
    if (!e.altKey) {
      return
    }

    /**
     *
     * @param {string} str
     * @param {number} index
     * @returns {number}
     */
    const line_number = (str, index) => str.slice(0, index).split("\n").length

    switch (e.key) {
      case "f":
        {
          e.preventDefault()
          const beginning = this.textarea?.selectionStart
          const end = this.textarea?.selectionEnd
          const input_value = this.textarea?.value ?? ""

          this.#show_section_add_dialog(
            line_number(input_value, beginning),
            line_number(input_value, end),
            input_value.slice(beginning, end)
          )
        }
        break
      case "g":
        {
          e.preventDefault()
          this.#handle_save()
        }
        break
      case "k":
        {
          e.preventDefault()
          // @ts-ignore
          document.querySelector("[js-role=file-compile]")?.click()
        }
        break
    }
  }

  /**
   *
   * @param {number} beginning
   * @param {number} end
   * @param {string} contents
   */
  #show_section_add_dialog = async (beginning, end, contents) => {
    select_or_throw("#section_file_id", this.section_add_dialog).value =
      get_file_id()
    select_or_throw("#section_beginning", this.section_add_dialog).value =
      beginning
    select_or_throw(
      "#section_beginning_preview",
      this.section_add_dialog
    ).value = beginning
    select_or_throw("#section_end", this.section_add_dialog).value = end
    select_or_throw("#section_end_preview", this.section_add_dialog).value = end

    select_or_throw("#section_contents", this.section_add_dialog).value =
      contents
    select_or_throw(
      "#section_contents_preview",
      this.section_add_dialog
    ).textContent = contents

    select_or_throw(
      "#section_kind",
      this.section_add_dialog
    ).innerHTML = html` <option value="" disabled selected>
        Select section type
      </option>
      ${(
        await fetch("/section/types/", {
          method: "POST",
        })
          .then(r => r.json())
          .then(r => {
            if (!r.ok) {
              throw r.error
            }

            return r.data.map(([short, long]) => ({ short, long }))
          })
      ).map(row => html`<option value=${row.short}>${row.long}</option>`)}`

    this.section_add_dialog.showModal()
  }

  /**
   * @param {import("./router.mjs").RouterState} state
   */
  on_change = state => {
    switch (state.type) {
      case RouterStateType.file_change:
        this.fetch_file(state.payload?.file_id)
        break
    }
  }

  #handle_section_add = () => {
    const body = new FormData(select_or_throw("form", this.section_add_dialog))
    const beginning = body.get("beginning")?.toString() ?? "1"
    const end = body.get("end")?.toString() ?? "1"

    body.set("beginning", `${+beginning - 1}`)
    body.set("end", `${+end - 1}`)
    fetch("/section/add/", {
      method: "POST",
      body,
    })
      .then(r => r.json())
      .then(r => {
        if (!r.ok) {
          throw new Error(r.error)
        }

        return this.fetch_file(get_file_id())
      })
      .then(() => this.section_add_dialog.close())
      .catch(alert)
  }

  /**
   *
   * @param {number} line_number
   */
  scroll_to_line = line_number => {
    const rects = this.line_numbers
      ?.querySelector(`.line-numbers__nr:nth-of-type(${line_number})`)
      ?.getBoundingClientRect()

    this.root?.scrollBy({
      top: (rects?.top ?? 0) - 2 * rects.height - 32.5,
      behavior: "smooth",
    })
  }

  render = () => {
    this.line_numbers.innerHTML = this.contents
      .split("\n")
      .map(_ => `<span class="line-numbers__nr"></span>`)
      .concat(
        ...this.sections
          .sort((a, b) => a.beginning - b.beginning)
          .map(
            s =>
              html`<span
                class="code__section"
                style="--top:${s.beginning}; --size:${s.end -
                s.beginning +
                1}; --color:${this.#color_of_type(s.kind)}"
                title="${s.name}"
              >
                <svg
                  js-data-id="${s.id}"
                  js-data-name="${s.name}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                  <path
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  />
                </svg>
              </span>`
          )
      )
      .join("")

    this.textarea.textContent = this.contents
  }

  unmount = () => {
    this.root.innerHTML = ""
  }
}
