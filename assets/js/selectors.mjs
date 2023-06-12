export const file_id_regex = /\/file\/(\d+)\//
export const fragment_regex =
  /(;-+\n(?:(?!^[^;])[\w\W])+)((?:(?!^;-+)[\w\W])+)/gim
export const line_link_regex = /([\w\W]*\w+\.c:)(\d+)(?::(\d+))?([\w\W]*$)/

/**
 *
 * @returns {number}
 */
export const get_file_id = () => {
  const file_id_match = file_id_regex.exec(location.href)
  return file_id_match && +file_id_match[1]
}

/**
 *
 * @param {string} str
 * @returns {boolean}
 */
export const is_line_link = str => line_link_regex.test(str)

/**
 *
 * @param {string} str expected to match `line_link_regex`
 * @returns {{pre: string, post: string, beginning: number, end: number}}
 */
export const line_link_range = str => {
  const m = line_link_regex.exec(str)

  if (!m) {
    throw new Error(
      `line_link_range error: expected '${str}' to match line_link_regex`
    )
  }

  const pre = m[1]
  const beginning = +m[2]
  const end = +(m[3] ?? m[2])
  const post = m[4]

  return { pre, post, beginning, end }
}
