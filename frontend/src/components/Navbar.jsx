import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaGlobe } from 'react-icons/fa';
import Logo from '../assets/Logo.webp';


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-[#1E2024] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="h-20" />
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-gray-800 text-white border border-white px-4 py-2 rounded-4xl hover:bg-gray-600 flex items-center"
          >
            <FaGlobe className="mr-2" />
            Idioma
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
            <ul className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded shadow-lg">
              <li
                className={`flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer ${language === 'es' ? 'font-bold' : ''}`}
                onClick={() => handleLanguageChange('es')}
              >
                <span className="mr-2">🇪🇸</span>
                Español
              </li>
              <li
                className={`flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer ${language === 'en' ? 'font-bold' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                <span className="mr-2">🇺🇸</span>
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