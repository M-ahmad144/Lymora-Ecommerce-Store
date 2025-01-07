const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="z-50 fixed inset-0 flex justify-center items-center">
          {/* Dark Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Modal Content */}
          <div className="relative bg-[#2D2D2D] shadow-xl p-8 rounded-lg w-full max-w-lg text-black transform transition-all duration-300 ease-in-out scale-100">
            <button
              className="top-4 right-4 absolute font-bold text-2xl text-black hover:text-gray-300 transition-all focus:outline-none"
              onClick={onClose}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
