import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import { ClipLoader } from "react-spinners";

const CategoryList = () => {
  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Redux hooks
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      setName("");
      toast.success(`${result.name} created.`);
    } catch (error) {
      toast.error("Failed to create category.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }
    try {
      await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      toast.success("Category updated.");
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (error) {
      toast.error("Failed to update category.");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success("Category deleted.");
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="flex md:flex-row flex-col bg-[#121212] min-h-screen text-black">
      {/* Admin Menu */}
      <AdminMenu />

      {/* Content Section */}
      <div className="flex flex-col mx-auto p-4 w-full md:w-3/4">
        <h1 className="mb-4 font-semibold text-2xl text-center text-pink-500">
          Manage Categories
        </h1>

        {/* Create Category Form */}
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
          buttonText={isCreating ? "Creating..." : "Create"}
          isLoading={isCreating}
        />
        <hr className="border-gray-700 my-6" />

        {/* Loader when categories are loading */}
        {categoriesLoading ? (
          <div className="flex justify-center items-center py-4">
            <ClipLoader color="#f472b6" size={50} />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="p-2 w-full sm:w-[5%] md:w-1/3 lg:w-[12%]"
              >
                <button
                  className="border-pink-500 bg-transparent hover:bg-pink-500 focus:ring-opacity-50 m-3 px-4 py-2 border rounded-lg focus:ring-pink-500 focus:ring-2 w-full text-pink-500 hover:text-white focus:outline-none"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Updating Category */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText={isUpdating ? "Updating..." : "Update"}
            handleDelete={handleDeleteCategory}
            isLoading={isUpdating || isDeleting}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
