defmodule UwuEditor.Repo.Migrations.CreateTreeNodes do
  use Ecto.Migration

  def change do
    create table(:tree_nodes, primary_key: false) do
      add :id, :binary_id, primary_key: true, null: false
      add :name, :varchar, null: false
      add :description, :text, null: true
      add :creation_date, :date, default: fragment("current_date")
      add :available, :boolean, default: true, null: false
      add :availability_change_date, :date, null: false, default: fragment("current_date")
      add :content_change_date, :date, default: fragment("current_date")
      add :owner_id, references(:users, type: :binary_id), null: false

      timestamps()
    end
  end
end
