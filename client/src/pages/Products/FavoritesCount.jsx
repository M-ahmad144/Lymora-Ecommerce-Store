import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="top-8 left-2 absolute">
      {favoriteCount > 0 && (
        <span className="bg-pink-500 px-1 py-0 rounded-full text-sm text-white">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
