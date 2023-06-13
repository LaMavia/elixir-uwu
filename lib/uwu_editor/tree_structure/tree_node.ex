defmodule UwuEditor.TreeStructure.TreeNode do
  use Ecto.Schema
  import Ecto.Changeset
  # import Ecto.Migration, only: []

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "tree_nodes" do
    field :availability_change_date, :date
    field :available, :boolean, default: false
    field :content_change_date, :date
    field :creation_date, :date
    field :description, :string
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(tree_node, attrs) do
    tree_node
    |> cast(attrs, [:name, :description, :creation_date, :available, :availability_change_date, :content_change_date])
    |> validate_required([:name, :description, :creation_date, :available, :availability_change_date, :content_change_date])
  end
end
