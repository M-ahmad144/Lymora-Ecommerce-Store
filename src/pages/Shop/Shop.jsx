import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../../redux/features/shop/shopSlice";
import Loader from "../../components/Loader";
import ProductItem from "../Products/ShopProductItem";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  // Fetch categories and products
  const { data: categoryData, isLoading: categoryLoading } =
    useFetchCategoriesQuery();
  const { data: productData, isLoading: productLoading } =
    //get the filtered products if the filter is given otherwise get all products
    useGetFilteredProductsQuery({ checked, radio });

  // Local states
  const [priceFilter, setPriceFilter] = useState("");

  // Dispatch categories to Redux store when fetched
  useEffect(() => {
    if (categoryData) {
      dispatch(setCategories(categoryData));
    }
  }, [categoryData, dispatch]);

  // Filter products by categories, price, and brands
  useEffect(() => {
    if (productData) {
      const filteredProducts = productData.filter((product) => {
        const matchesPrice = priceFilter
          ? product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          : true;
        return matchesPrice;
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [checked, radio, productData, priceFilter, dispatch]);

  // Unique brands (memoized)
  const uniqueBrands = useMemo(() => {
    return Array.from(
      new Set(productData?.map((product) => product.brand).filter(Boolean))
    );
  }, [productData]);

  // Handle checkbox selection for categories
  const handleCheck = (isChecked, id) => {
    const updatedChecked = isChecked
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Reset filters
  const resetFilters = () => {
    setPriceFilter("");
    dispatch(setChecked([]));
    dispatch(setProducts(productData || []));
  };

  return (
    <div className="mx-auto container">
      <div className="flex md:flex-row">
        {/* Filters */}
        <aside className="bg-[#151515] mt-2 mb-2 p-3">
          <h2 className="bg-black mb-2 py-2 rounded-full text-center h4">
            Filter by Categories
          </h2>
          <div className="p-5 w-[15rem]">
            {categories?.map((c) => (
              <div key={c._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="border-gray-300 bg-gray-100 rounded focus:ring-pink-500 w-4 h-4 text-pink-600"
                />
                <label className="ml-2 font-medium text-sm text-white">
                  {c.name}
                </label>
              </div>
            ))}
          </div>

          <h2 className="bg-black mb-2 py-2 rounded-full text-center h4">
            Filter by Brands
          </h2>
          <div className="p-5">
            {uniqueBrands.map((brand) => (
              <div key={brand} className="flex items-center mb-5">
                <input
                  type="radio"
                  name="brand"
                  onChange={() =>
                    dispatch(
                      setProducts(productData.filter((p) => p.brand === brand))
                    )
                  }
                  className="border-gray-300 bg-gray-100 focus:ring-pink-500 w-4 h-4 text-pink-400"
                />
                <label className="ml-2 font-medium text-sm text-white">
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="bg-black mb-2 py-2 rounded-full text-center h4">
            Filter by Price
          </h2>
          <div className="p-5 w-[15rem]">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="focus:border-pink-300 px-3 py-2 border rounded-lg focus:ring w-full focus:outline-none placeholder-gray-400"
            />
          </div>

          <div className="p-5 pt-0">
            <button className="my-4 border w-full" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </aside>

        {/* Products */}
        <main className="p-3">
          <h2 className="mb-2 text-center h4">{products?.length} Products</h2>
          <div className="flex flex-wrap">
            {productLoading || products.length === 0 ? (
              <Loader />
            ) : (
              products.map((p) => (
                <div className="p-3" key={p._id}>
                  <ProductItem p={p} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
