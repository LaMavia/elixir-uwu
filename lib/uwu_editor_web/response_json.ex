defmodule UwuEditorWeb.ResponseJSON do
  import Plug.Conn
  import Phoenix.Controller

  defp generic_msg(conn, ok, data, error, status, cookies) do
    Enum.reduce(cookies, put_status(conn, status), fn conn, {k, v} -> put_resp_cookie(conn, k, v) end)
    |> json(%{ok: ok, data: data, error: error})
  end

  def ok(conn, data \\ %{}, status \\ 200, cookies \\ []) do
    generic_msg(conn, true, data, nil, status, cookies)
  end

  def error(conn, error \\ %{}, status \\ 400, cookies \\ []) do
    generic_msg(conn, true, nil, error, status, cookies)
  end
end
