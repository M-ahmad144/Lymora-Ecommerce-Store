import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoritesSlice";
import ProductCard from "./ProductCard";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="mt-[3rem] mb-8 ml-[3rem] font-semibold text-3xl text-pink-600">
        FAVORITE PRODUCTS
      </h1>

      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
