import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mt-24">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="md:ml-32 w-full md:w-[40rem]">
          {products.map(({ image, _id, name, price, description }) => (
            <div key={_id} className="relative group">
              {/* Carousel Image */}
              <img
                src={image}
                alt={name}
                className="group-hover:scale-105 rounded-lg w-full md:w-[40rem] h-auto md:h-[auto] transition-transform duration-300 object-cover"
              />

              {/* Text Details for Medium Screens and Above */}
              <div className="shadow-lg mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg truncate">{name}</h2>
                  <p className="font-semibold text-lg text-pink-500">
                    ${price}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
