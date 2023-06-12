defmodule UwuEditorWeb.UserController do
  use UwuEditorWeb, :controller

  # alias UwuEditor.Accounts
  # alias UwuEditorWeb.UserAuth

  def login_view(conn, _params), do: render(conn, :login, layout: false)
  def register_view(conn, _params), do: render(conn, :register, layout: false)
end
