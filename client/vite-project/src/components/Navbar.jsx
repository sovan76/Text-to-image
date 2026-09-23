import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const {
    user,
    credit,
    logout,
    setIsLoginOpen,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-4">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-28 sm:w-32 lg:w-40 h-12"
        />
      </Link>

      {/* Right Section */}
      {user ? (
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Credits */}
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full hover:bg-blue-200 transition-all duration-300"
          >
            <img
              src={assets.credit_star}
              alt="credits"
              className="w-5"
            />

            <p className="text-sm font-medium text-gray-700">
              Credits Left: {credit}
            </p>
          </button>

          {/* Username */}
          <p className="hidden sm:block text-gray-700">
            Hi, {user?.name}
          </p>

          {/* Profile Dropdown */}
          <div
            ref={menuRef}
            className="relative"
          >
            <img
              src={assets.profile_icon}
              alt="Profile"
              onClick={() =>
                setShowMenu((prev) => !prev)
              }
              className="w-10 h-10 rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 z-50">
                <div className="bg-white border rounded-xl shadow-lg min-w-[140px] overflow-hidden">
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 sm:gap-5">
          <p
            onClick={() => navigate("/pricing")}
            className="cursor-pointer text-gray-700"
          >
            Pricing
          </p>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-700 text-white px-7 py-2 sm:px-10 rounded-full hover:bg-blue-800 transition-all duration-300"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;