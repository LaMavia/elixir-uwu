defmodule UwuEditor.TreeStructure do
  @moduledoc """
  The TreeStructure context.
  """

  import Ecto.Query, warn: false
  alias UwuEditor.Repo

  alias UwuEditor.TreeStructure.TreeNode

  @doc """
  Returns the list of tree_nodes.

  ## Examples

      iex> list_tree_nodes()
      [%TreeNode{}, ...]

  """
  def list_tree_nodes do
    Repo.all(TreeNode)
  end

  @doc """
  Gets a single tree_node.

  Raises `Ecto.NoResultsError` if the Tree node does not exist.

  ## Examples

      iex> get_tree_node!(123)
      %TreeNode{}

      iex> get_tree_node!(456)
      ** (Ecto.NoResultsError)

  """
  def get_tree_node!(id), do: Repo.get!(TreeNode, id)

  @doc """
  Creates a tree_node.

  ## Examples

      iex> create_tree_node(%{field: value})
      {:ok, %TreeNode{}}

      iex> create_tree_node(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_tree_node(attrs \\ %{}) do
    %TreeNode{}
    |> TreeNode.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a tree_node.

  ## Examples

      iex> update_tree_node(tree_node, %{field: new_value})
      {:ok, %TreeNode{}}

      iex> update_tree_node(tree_node, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_tree_node(%TreeNode{} = tree_node, attrs) do
    tree_node
    |> TreeNode.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a tree_node.

  ## Examples

      iex> delete_tree_node(tree_node)
      {:ok, %TreeNode{}}

      iex> delete_tree_node(tree_node)
      {:error, %Ecto.Changeset{}}

  """
  def delete_tree_node(%TreeNode{} = tree_node) do
    Repo.delete(tree_node)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking tree_node changes.

  ## Examples

      iex> change_tree_node(tree_node)
      %Ecto.Changeset{data: %TreeNode{}}

  """
  def change_tree_node(%TreeNode{} = tree_node, attrs \\ %{}) do
    TreeNode.changeset(tree_node, attrs)
  end
end
