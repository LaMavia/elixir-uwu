defmodule UwuEditor.TreeStructureFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `UwuEditor.TreeStructure` context.
  """

  @doc """
  Generate a tree_node.
  """
  def tree_node_fixture(attrs \\ %{}) do
    {:ok, tree_node} =
      attrs
      |> Enum.into(%{
        availability_change_date: ~D[2023-06-11],
        available: true,
        content_change_date: ~D[2023-06-11],
        creation_date: ~D[2023-06-11],
        description: "some description",
        name: "some name"
      })
      |> UwuEditor.TreeStructure.create_tree_node()

    tree_node
  end
end
