defmodule UwuEditorWeb.PageController do
  use UwuEditorWeb, :controller

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end
end
