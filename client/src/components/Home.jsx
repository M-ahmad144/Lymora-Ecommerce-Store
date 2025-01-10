import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import Message from "./Message";
import Header from "./Header";
import Product from "../pages/Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  console.log(data);
  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="mt-[10rem] ml-[20rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 mt-[10rem] mr-[18rem] px-10 py-2 rounded-full font-bold"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex flex-wrap justify-center mt-[2rem]">
              {data && data.products && data.products.length > 0 ? (
                data.products.map((product) => (
                  <div key={product._id}>
                    <Product product={product} />
                  </div>
                ))
              ) : (
                <p>No special products available at the moment.</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
