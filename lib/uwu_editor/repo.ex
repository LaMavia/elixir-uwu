defmodule UwuEditor.Repo do
  use Ecto.Repo,
    otp_app: :uwu_editor,
    adapter: Ecto.Adapters.Postgres
end
