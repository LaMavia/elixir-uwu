defmodule UwuEditor.TreeStructure.TreeNode do
  alias Ecto.Changeset
  alias UwuEditor.TreeStructure.TreeNode
  alias UwuEditor.Repo
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
    |> cast(attrs, [
      :name,
      :description,
      :creation_date,
      :available,
      :availability_change_date,
      :content_change_date
    ])
    |> validate_required([:name])
  end

  @spec disable(term) :: {:error, any} | {:ok, 1}
  def disable(tree_node_id) do
    with {:ok, tree_node} <- Repo.get(TreeNode, tree_node_id),
         {:ok, _} <-
           Ecto.Changeset.change(tree_node, available: false)
           |> Repo.update() do
      {:ok, 1}
    else
      {:error, err} -> {:error, err}
    end
  end
end
