export const is_logged_in = () =>
  fetch("/is-logged-in/", {
    method: "POST",
  })
    .then(r => r.json())
    .then(r => r.ok)
    .catch(() => false)
