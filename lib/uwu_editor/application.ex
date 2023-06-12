defmodule UwuEditor.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      UwuEditorWeb.Telemetry,
      # Start the Ecto repository
      UwuEditor.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: UwuEditor.PubSub},
      # Start Finch
      {Finch, name: UwuEditor.Finch},
      # Start the Endpoint (http/https)
      UwuEditorWeb.Endpoint
      # Start a worker by calling: UwuEditor.Worker.start_link(arg)
      # {UwuEditor.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: UwuEditor.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    UwuEditorWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
