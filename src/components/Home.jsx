import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Message from "./Message";
import Header from "./Header";
import ProductCard from "../pages/Products/ProductCard";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}

      {isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
          <p className="text-center"></p>
        </Message>
      ) : (
        <>
          <div className="flex md:flex-row flex-col justify-between items-center px-4 py-6">
            <h1 className="md:ml-40 font-semibold text-[2.5rem] text-center text-pink-600 md:text-left md:text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 mt-4 md:mt-0 md:mr-[18rem] px-10 py-2 rounded-full font-bold text-sm text-white md:text-base"
            >
              Shop
            </Link>
          </div>

          {/* Products Grid Section */}
          <div className="flex justify-center mt-4">
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4">
              {data && data.products && data.products.length > 0 ? (
                data.products.map((product) => (
                  <div key={product._id} className="flex justify-center">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center">
                  No special products available at the moment.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
