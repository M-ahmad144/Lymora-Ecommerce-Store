import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
    country: shippingAddress?.country || "",
    paymentMethod: "PayPal",
  });

  const { address, city, postalCode, country, paymentMethod } = formData;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="mx-auto mt-10 px-4 max-w-screen-sm">
      <ProgressSteps step1 step2 />
      <form onSubmit={handleSubmit} className="mt-10">
        <h1 className="mb-6 font-bold text-center text-pink-800 text-xl">
          Shipping Information
        </h1>

        {["Address", "City", "Postal Code", "Country"].map((field) => (
          <div key={field} className="mb-4">
            <label
              htmlFor={field.toLowerCase().replace(" ", "")}
              className="block mb-1 font-medium text-gray-300 text-sm"
            >
              {field}
            </label>
            <input
              type="text"
              id={field.toLowerCase().replace(" ", "")}
              name={field.toLowerCase().replace(" ", "")}
              value={formData[field.toLowerCase().replace(" ", "")]}
              onChange={handleChange}
              placeholder={`Enter ${field.toLowerCase()}`}
              required
              className="p-2 border rounded focus:ring-2 focus:ring-pink-800 w-full text-black text-sm focus:outline-none"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-300 text-sm">
            Payment Method
          </label>
          <div className="flex items-center">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="paypal" className="text-pink-500 text-sm">
              PayPal or Credit Card
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 py-2 rounded w-full font-medium text-sm text-white"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Shipping;
