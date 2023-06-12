import { FormController } from "./form_controller.mjs";
import { navigate } from "./render_tools.mjs";
import { is_logged_in } from "./session.mjs";

window.addEventListener("load", async () => {
  if (await is_logged_in()) {
    navigate("/");
  }
  const login_controller = new FormController(
    {
      email: "",
      password: "",
    },
    "/api/login/",
    "/"
  );
});
