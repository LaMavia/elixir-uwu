defmodule UwuEditorWeb.PageHTML do
  use UwuEditorWeb, :html

  def home(assigns) do
    ~H"""
      <%= UwuEditorWeb.EditorComponents.config(assigns) %>
      <%= UwuEditorWeb.EditorComponents.editor(assigns) %>
      <%= UwuEditorWeb.EditorComponents.file_explorer(assigns) %>
      <%= UwuEditorWeb.EditorComponents.file_upload(assigns) %>
      <%= UwuEditorWeb.EditorComponents.fragment(assigns) %>
      <%= UwuEditorWeb.EditorComponents.nav(assigns) %>
      <script src={~p"/assets/index.js"}></script>
    """
  end
end
