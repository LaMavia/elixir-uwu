defmodule UwuEditorWeb.UserController do
  use UwuEditorWeb, :controller
  import UwuEditor.Accounts
  import UwuEditorWeb.ResponseJSON
  import UwuEditorWeb.UserAuth

  # alias UwuEditor.Accounts
  # alias UwuEditorWeb.UserAuth

  def login_view(conn, _params), do: render(conn, :login, layout: false)
  def register_view(conn, _params), do: render(conn, :register, layout: false)

  def is_logged_in_endpoint(conn, _params) do
    if get_session(conn, :user_token) do
      ok(conn, true)
    else
      error(conn, "User is not logged in")
    end
  end

  def login_endpoint(conn, params) do
    with (%{"email" => email, "password" => password} <- params)
    do
      if user = get_user_by_email_and_password(email, password) do
        ok(conn, user, 201) |> log_in_user_api(user)
      else
        error(conn, "Invalid email or password", 401)
      end
    else
      {:error, err} -> error(conn, err, 500)
    end
  end
end
