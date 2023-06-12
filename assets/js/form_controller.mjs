export class FormController {
  constructor(default_state = {}, endpoint = "/login/", on_success_url = "/") {
    this.state = default_state
    this.endpoint = endpoint
    this.on_success_url = on_success_url

    this.form_element = document.querySelector("form")
    this.form_element.addEventListener("submit", this.handle_submit)

    Object.keys(default_state).forEach(key =>
      document
        .querySelector(`input#${key}`)
        .addEventListener("input", this.handle_input(key))
    )
  }

  handle_input = key => e => {
    const given_val = e.currentTarget.value
    const field_type = typeof this.state[key]

    this.state[key] =
      field_type === "number"
        ? +given_val
        : field_type === "boolean"
        ? !!given_val
        : given_val
  }

  handle_submit = e => {
    e.preventDefault()

    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then(r => r.json())
      .then(r =>
        r.ok
          ? this.on_success_url
            ? window.location.assign(this.on_success_url)
            : window.location.reload()
          : alert(r.error)
      )
      .catch(e => alert(e))
  }
}
