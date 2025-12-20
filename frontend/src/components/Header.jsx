import { Phone,  Home, X,  Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Create a reference for the mobile menu

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#000]">
      {/* Top bar */}
      <div className="flex w-full relative bg-[#000]">
        {/* Left Section - White Background */}
        <div className="bg-white w-[60%] flex items-center lg:px-20 px-10 py-3">
          <img src="edu2medulogo.jpg" alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Right Section - Blue Background */}
        <div className="w-[40%] bg-[#17A2B8] flex justify-end items-center px-6 text-white relative before:absolute before:top-0 before:left-[-20px] before:w-12 before:h-full before:bg-white before:skew-x-[-30deg]">
          <div className="flex items-center gap-6 lg:px-10">
            {/* Animated Phone Number */}
         
<div className="hidden md:flex items-center gap-2 px-6">
  <motion.div
    animate={{ rotate: [-10, 10, -10] }}
    transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
  >
    <Phone className="h-6 w-6 text-white" />
  </motion.div>
  <motion.a
    href="tel:+919274333156"
    className="text-lg lg:text-2xl font-bold"
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
  >
    +91 9274333156
  </motion.a>
</div>

            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="px-4 py-1.5 text-sm border border-white font-bold rounded hover:bg-white hover:text-[#17A2B8] transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#1C1C1C] text-white lg:px-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <ul className="hidden lg:flex items-center gap-8">
              <li>
                <Link to="/" className="py-4 block">
                  <Home className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <Link to="/school" className="py-4 block">
                  EduHub
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="py-4 block">
                HealthCare
                </Link>
              </li>
              <li>
                <Link to="/news" className="py-4 block">
                  News
                </Link>
              </li>
              <li className="ml-auto">
                <Link to="/about" className="py-4 block">
                 About Us
                </Link>
              </li>
              <li className="ml-auto">
                <Link to="/contact" className="py-4 block">
                  Contact
                </Link>
              </li>
              <li className="ml-auto">
                <Link to="/jobs" className="py-4 block">
                Job opening
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <motion.div
            ref={menuRef} // Attach the reference to the mobile menu
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: menuOpen ? 1 : 0, x: menuOpen ? 0 : -200 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden bg-[#17A2B8] fixed top-[95px] left-0 w-64 h-full z-50 ${menuOpen ? "block" : "hidden"}`}
          >
            <ul className="flex flex-col items-start text-white p-6 gap-6 text-lg">
              <li>
                <Link to="/" className="py-4 block" onClick={() => setMenuOpen(false)}>
                  <Home className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <Link to="/school" className="py-2" onClick={() => setMenuOpen(false)}>
                  EduHub
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="py-2" onClick={() => setMenuOpen(false)}>
              HealthCare
                </Link>
              </li>
              <li>
                <Link to="/news" className="py-2" onClick={() => setMenuOpen(false)}>
                  News
                </Link>
              </li>
              <li>
                
                <Link to="/about" className="py-2" onClick={() => setMenuOpen(false)}>
                About Us
                </Link>
              </li>
              <li>
                
                <Link to="/jobs" className="py-2" onClick={() => setMenuOpen(false)}>
          Job opening
                </Link>
              </li>
              

              <li>
                <Link to="/contact" className="py-2" onClick={() => setMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
      </nav>
    </header>
  ); 
}
