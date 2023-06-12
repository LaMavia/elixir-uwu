//@ts-check

/**
 * @param {TemplateStringsArray} strings
 * @param  {any[]} args
 * @returns {string}
 */
export const html = (strings, ...args) =>
  strings.length === 0
    ? ""
    : args
        .map(a => a ?? "")
        .reduce((u, a, i) => {
          const arg_rendered = Array.isArray(a)
            ? a.map(x => html`${x}`).join("\n")
            : typeof a === "object"
            ? Object.entries(a).map(([k, v]) => ` ${k}="${v}" `)
            : typeof a === "string"
            ? a
            : `${a}`
          return `${u}${arg_rendered}${strings[i + 1].trim()}`
        }, strings[0].trim())
        .replaceAll(/>\s*</gim, "><")
        .replaceAll(
          /(<\/?\w+(?:\s+[^\s]+)*?)(\s{2,})((?: [^\s]+)*>)/gim,
          "$1 $3"
        )
// .replace(/^\s*/, "")

/**
 * @param {string} url
 * @param {string | undefined} title
 * @returns {void}
 */
export const navigate = (url, title = document.title) =>
  history.pushState(
    {
      html: document.querySelector("html")?.innerHTML ?? "",
      pageTitle: title,
    },
    "",
    url
  )

export const init_router = () =>
  window.addEventListener("popstate", e => {
    if (e.state) {
      document.body.innerHTML = e.state.html
      document.title = e.state.pageTitle
    }
  })
