defmodule UwuEditor.TreeStructureTest do
  use UwuEditor.DataCase

  alias UwuEditor.TreeStructure

  describe "tree_nodes" do
    alias UwuEditor.TreeStructure.TreeNode

    import UwuEditor.TreeStructureFixtures

    @invalid_attrs %{
      availability_change_date: nil,
      available: nil,
      content_change_date: nil,
      creation_date: nil,
      description: nil,
      name: nil
    }

    test "list_tree_nodes/0 returns all tree_nodes" do
      tree_node = tree_node_fixture()
      assert TreeStructure.list_tree_nodes() == [tree_node]
    end

    test "get_tree_node!/1 returns the tree_node with given id" do
      tree_node = tree_node_fixture()
      assert TreeStructure.get_tree_node!(tree_node.id) == tree_node
    end

    test "create_tree_node/1 with valid data creates a tree_node" do
      valid_attrs = %{
        availability_change_date: ~D[2023-06-11],
        available: true,
        content_change_date: ~D[2023-06-11],
        creation_date: ~D[2023-06-11],
        description: "some description",
        name: "some name"
      }

      assert {:ok, %TreeNode{} = tree_node} = TreeStructure.create_tree_node(valid_attrs)
      assert tree_node.availability_change_date == ~D[2023-06-11]
      assert tree_node.available == true
      assert tree_node.content_change_date == ~D[2023-06-11]
      assert tree_node.creation_date == ~D[2023-06-11]
      assert tree_node.description == "some description"
      assert tree_node.name == "some name"
    end

    test "create_tree_node/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = TreeStructure.create_tree_node(@invalid_attrs)
    end

    test "update_tree_node/2 with valid data updates the tree_node" do
      tree_node = tree_node_fixture()

      update_attrs = %{
        availability_change_date: ~D[2023-06-12],
        available: false,
        content_change_date: ~D[2023-06-12],
        creation_date: ~D[2023-06-12],
        description: "some updated description",
        name: "some updated name"
      }

      assert {:ok, %TreeNode{} = tree_node} =
               TreeStructure.update_tree_node(tree_node, update_attrs)

      assert tree_node.availability_change_date == ~D[2023-06-12]
      assert tree_node.available == false
      assert tree_node.content_change_date == ~D[2023-06-12]
      assert tree_node.creation_date == ~D[2023-06-12]
      assert tree_node.description == "some updated description"
      assert tree_node.name == "some updated name"
    end

    test "update_tree_node/2 with invalid data returns error changeset" do
      tree_node = tree_node_fixture()

      assert {:error, %Ecto.Changeset{}} =
               TreeStructure.update_tree_node(tree_node, @invalid_attrs)

      assert tree_node == TreeStructure.get_tree_node!(tree_node.id)
    end

    test "delete_tree_node/1 deletes the tree_node" do
      tree_node = tree_node_fixture()
      assert {:ok, %TreeNode{}} = TreeStructure.delete_tree_node(tree_node)
      assert_raise Ecto.NoResultsError, fn -> TreeStructure.get_tree_node!(tree_node.id) end
    end

    test "change_tree_node/1 returns a tree_node changeset" do
      tree_node = tree_node_fixture()
      assert %Ecto.Changeset{} = TreeStructure.change_tree_node(tree_node)
    end
  end
end
