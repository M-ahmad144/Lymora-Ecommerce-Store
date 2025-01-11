import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      {/* outlet - this is where the child routes will be rendered */}
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
}
