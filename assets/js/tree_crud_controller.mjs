// @ts-check

import { select_or_throw } from "./helpers.mjs"
import { html } from "./render_tools.mjs"
import { RouterStateType } from "./router.mjs"

export class TreeCrudControlled {
  #file_add_role = "file_add"
  #directory_add_role = "directory_add"
  #file_delete_role = "file_delete"
  #directory_delete_role = "directory_delete"
  #dialog_selector = "dialog[js-role=tree_crud]"

  constructor() {
    // this.file_upload_controller = file_upload_controller
    this.files_element = select_or_throw("#files")

    /**
     * @type HTMLDialogElement
     */
    // @ts-ignore
    this.dialog_element = select_or_throw(this.#dialog_selector)
    this.dialog_title_element = select_or_throw(
      `#tree_crud_dialog_title`,
      this.dialog_element
    )
    this.dialog_contents_element = select_or_throw(
      `#tree_crud_dialog_contents`,
      this.dialog_element
    )
    /**
     * @type HTMLFormElement
     */
    // @ts-ignore
    this.dialog_form_element = select_or_throw(
      `#tree_crud_form`,
      this.dialog_element
    )
    this.dialog_cancel_button = select_or_throw(
      "[js-role=file_upload_close]",
      this.dialog_element
    )

    this.dialog_form_element.addEventListener("submit", this.handle_submit)

    this.files_element.addEventListener("click", this.handle_files_click, {
      capture: false,
    })

    this.dialog_cancel_button.addEventListener("click", this.#close_dialog)
    this.#render().catch(alert)
  }

  /**
   * @param {{title: string, contents: string, form_href: string}} param0
   */
  #show_dialog = ({ title, contents, form_href }) => {
    this.dialog_title_element.innerText = title
    this.dialog_contents_element.innerHTML = contents
    this.dialog_form_element.setAttribute("action", form_href)

    this.dialog_element.showModal()
  }

  /**
   * @param {MouseEvent} e
   */
  #close_dialog = e => {
    e.preventDefault()
    e.stopPropagation()

    this.dialog_element.close()
  }

  /**
   *
   * @param {number} node_id
   * @param {string} node_name
   * @returns string
   */
  #render_delete = (node_id, node_name) =>
    `
    <p class="dialog__text"> 
      Are you sure you want to delete <span>${node_name}</span>?
    </p>
    <input type="hidden" value="${node_id}" name="node_id">
    `

  /**
   *
   * @param {number | undefined} parent_id
   * @param {string} parent_name
   * @returns string
   */
  #render_add_dir = (parent_id, parent_name) =>
    `
    <p class="dialog__text"> 
      parent: <b>${parent_name || "(root)"}</b>
    </p>
    <div class=dialog__input-group>
      <input 
        class="dialog__input dialog__input--text form__input" type="text" 
        id="directory_name" 
        name="name" required
        placeholder="name (required)"
      >
      <input type="hidden" name="parent_id" ${
        parent_id !== undefined ? `value="${parent_id}"` : ""
      }>
      <textarea 
        class="dialog__input dialog__input--text form__input" 
        name="description"
        placeholder="description (optional)"
      ></textarea>
    </div>
    `

  /**
   *
   * @param {number | undefined} parent_id
   * @param {string} parent_name
   * @returns {string}
   */
  #render_add_file = (parent_id, parent_name) =>
    html`
      <p class="dialog__text">parent: <b>${parent_name || "(root)"}</b></p>
      <div class="dialog__input-group">
        <input
          class="dialog__input dialog__input--file"
          type="file"
          name="file"
          id="dialog_file"
          accept=".c"
        />
        <input
          type="hidden"
          name="parent_id"
          ${parent_id !== undefined ? `value="${parent_id}"` : ""}
        />
        <textarea
          class="dialog__input dialog__input--text form__input"
          name="description"
          placeholder="description (optional)"
        ></textarea>
      </div>
    `

  /**
   *
   * @param {number} id
   * @param {string} name
   * @param {{dir_add?: boolean, file_add?: boolean, del?: boolean}} icons
   * @returns
   */
  #render_actions_node = (id, name, { dir_add, file_add, del }, kind) => {
    const data = { "data-id": id, "data-name": name }
    return html`
      <div class="label__actions actions">
        ${dir_add
          ? html`<button
              ${data}
              js-role="directory_add"
              class="actions__button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24V312h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V200c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H168c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"
                />
              </svg>
            </button>`
          : ""}
        ${file_add
          ? html`<button ${data} js-role="file_add" class="actions__button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"
                />
              </svg>
            </button>`
          : ""}
        ${del
          ? html`<button
              ${data}
              js-role="${kind}_delete"
              class="actions__button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </button>`
          : ""}
      </div>
    `
  }

  /**
   * @typedef {{
   * name: string,
   * creation_date: string,
   * owner: number,
   * availability_change_date: string | null,
   * available: boolean,
   * content_change_date: string,
   * contents: string,
   * description: string,
   * id: number
   * }} FileNode
   *
   * @param {FileNode} file
   * @returns
   */
  #render_file = file => html`
    <li class="tree__item tree__item--file label">
      <a
        data-href="/file/${file.id}/"
        js-data-type="${RouterStateType.file_change}"
        js-data-payload="${file.id}"
        href="/file/${file.id}/"
        class="file label__link"
        >${file.name}</a
      >
      ${this.#render_actions_node(file.id, file.name, { del: true }, "file")}
    </li>
  `

  /**
   * @typedef {{
   * name: string,
   * creation_date: string,
   * owner: number,
   * availability_change_date: string | null,
   * available: boolean,
   * description: string,
   * id: number
   * }} DirectoryNode
   *
   * @typedef {{directory_add
   * directory: DirectoryNode | null,
   * files: FileNode[],
   * children: SupDirectoryNode[]
   * }} SupDirectoryNode
   *
   * @param {SupDirectoryNode} dir
   * @returns
   */
  #render_dir = dir =>
    dir.directory
      ? html`
          <li class="tree__item tree__item--dir dir">
            <input
              type="checkbox"
              name="dir__${dir.directory.id}"
              id="dir__${dir.directory.id}"
              class="dir__input"
            />
            <label for="dir__${dir.directory.id}" class="dir__switch"></label>
            <div class="dir__label label">
              <a
                data-href="directories/${dir.directory.id}/"
                class="label__link"
                >${dir.directory.name}</a
              >
              ${this.#render_actions_node(
                dir.directory.id,
                dir.directory.name,
                { dir_add: true, file_add: true, del: true },
                "directory"
              )}
            </div>
            <ul class="dir__content tree">
              ${dir.children.map(this.#render_dir)}
              ${dir.files.map(this.#render_file)}
            </ul>
          </li>
        `
      : html`${dir.children.map(this.#render_dir)}
        ${dir.files.map(this.#render_file)}`

  /**
   *
   * @returns {Promise<void>}
   */
  #render = () =>
    fetch("/directory/root/", {
      method: "POST",
    })
      .then(r => r.json())
      .then(r => {
        if (!r.ok) {
          throw new Error(r.error)
        }

        return this.#render_dir(r.data)
      })
      .catch(e => {
        console.error(e)
        alert(JSON.stringify(e, null, 2))
        return html`ERROR`
      })
      .then(h => {
        const root = this.files_element.querySelector("#files-root-tree")
        root && (root.innerHTML = h)
      })

  /**
   * @param {MouseEvent} e
   */
  handle_files_click = e => {
    //@ts-ignore
    const raw_id = e.target?.getAttribute("data-id")
    const id = raw_id === null ? undefined : +raw_id
    //@ts-ignore
    const name = e.target?.getAttribute("data-name")
    //@ts-ignore
    const role = e.target?.getAttribute("js-role")

    switch (role) {
      case this.#file_add_role:
        return this.handle_file_add(id, name)
      case this.#directory_add_role:
        return this.handle_directory_add(id, name)
      case this.#file_delete_role:
        return id !== undefined && this.handle_file_delete(id, name)
      case this.#directory_delete_role:
        return id !== undefined && this.handle_directory_delete(id, name)
    }
  }

  /**
   * @param {number | undefined} dir_id
   * @param {string} dir_name
   */
  handle_file_add = (dir_id, dir_name) => {
    this.#show_dialog({
      title: "add a file",
      contents: this.#render_add_file(dir_id, dir_name),
      form_href: `/file/add/`,
    })
  }

  /**
   * @param {number | undefined} dir_id
   * @param {string} dir_name
   */
  handle_directory_add = (dir_id, dir_name) => {
    this.#show_dialog({
      title: "add a directory",
      contents: this.#render_add_dir(dir_id, dir_name),
      form_href: `/directory/add/`,
    })
  }

  /**
   * @param {number} id
   * @param {string} name
   */
  handle_file_delete = (id, name) => {
    this.#show_dialog({
      title: "delete a file",
      contents: this.#render_delete(id, name),
      form_href: `/file/${id}/delete/`,
    })
  }

  /**
   * @param {number} id
   * @param {string} name
   */
  handle_directory_delete = (id, name) => {
    this.#show_dialog({
      title: "delete a directory",
      contents: this.#render_delete(id, name),
      form_href: `/directory/${id}/delete/`,
    })
  }

  /**
   *
   * @param {SubmitEvent} e
   */
  handle_submit = e => {
    e.preventDefault()
    const url = this.dialog_form_element.getAttribute("action")
    const method = this.dialog_form_element.getAttribute("method")
    if (!url || !method) {
      return
    }

    const data = new FormData(this.dialog_form_element)

    fetch(url, {
      body: data,
      method: method.toUpperCase(),
    })
      .then(r => r.json())
      .then(r =>
        r.ok ? (this.#render(), this.dialog_element.close()) : alert(r.error)
      )
      .catch(e => alert(e))
  }

  unmount = () => {
    // @ts-ignore
    this.files_element.removeEventListener("click", this.handle_files_click)
  }
}
