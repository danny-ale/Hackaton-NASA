import React from 'react';
import Logo from '../assets/logo.webp';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#1E2024] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="h-15" />
        </div>
        {/* Language Switch Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200 flex items-center"
          >
            Change Language
            <svg
              className="w-4 h-4 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white text-blue-500 rounded shadow-lg">
              <li className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer">
                <img src="/path-to-spanish-flag.png" alt="Spanish" className="h-4 w-4 mr-2" />
                Español
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer">
                <img src="/path-to-english-flag.png" alt="English" className="h-4 w-4 mr-2" />
                English
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;