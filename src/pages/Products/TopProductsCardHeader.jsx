import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const TopProductsCardHeader = ({ product }) => {
  const cardStyle = {
    padding: "1rem",
    width: "100%",
    maxWidth: "20rem",
    transition: "transform 0.3s",
  };

  const imageStyle = {
    borderRadius: "0.5rem",
    width: "100%",
    height: "auto",
    aspectRatio: "4 / 3",
    objectFit: "cover",
    transition: "transform 0.3s",
  };

  const titleStyle = {
    fontWeight: "500",
    color: "#2D3748",
    fontSize: "1rem",
    lineHeight: "1.25",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const priceStyle = {
    backgroundColor: "#FED7E2",
    color: "#D53F8C",
    padding: "0.125rem 0.5rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "500",
  };

  const exploreStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "0.5rem",
    color: "#D53F8C",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "color 0.2s",
  };

  const svgStyle = {
    width: "1.25rem",
    height: "1.25rem",
    marginLeft: "0.5rem",
  };

  return (
    <div style={cardStyle} className="md:ml-12 hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          style={imageStyle}
          className="hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
        <div className="flex justify-between items-center mt-2">
          <h2 style={titleStyle}>{product.name}</h2>
          <span style={priceStyle}>${product.price}</span>
        </div>
        <div style={exploreStyle} className="hover:text-pink-800">
          <span>Explore</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            style={svgStyle}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default TopProductsCardHeader;
