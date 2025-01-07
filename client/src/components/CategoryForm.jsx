const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Create",
  isLoading,
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="px-4 py-3 border rounded-lg w-full"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className={`${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            } px-4 py-2 rounded-lg text-black focus:outline-none`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div
                  className="spinner-border-sm spinner-border text-white"
                  role="status"
                >
                  <span className="text-black sr-only">Loading...</span>
                </div>
                <span className="ml-2">processing...</span>{" "}
              </div>
            ) : (
              buttonText
            )}
          </button>

          {/* Show Delete Button if available and not in loading state */}
          {handleDelete && !isLoading && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-opacity-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 text-black focus:outline-none"
            >
              {isLoading ? (
                <div
                  className="spinner-border-sm spinner-border text-white"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
