import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Upload, User, LogOut, Search } from "lucide-react";
import "./Navbar.css";

export default function Navbar({ profile }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    setIsNavigating(true);
    localStorage.removeItem("google_profile");
    navigate("/login");
  };

  const handleNavigation = (href) => {
    setIsNavigating(true);
    navigate(href);
  };

  return (
    <nav className="navbar w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 shadow-sm fixed top-0 left-0 z-50 flex items-center justify-between px-4 sm:px-8 h-16">
      <div className="flex items-center gap-4">
        <Link to="/discover" className="navbar-brand group">
          <img src="/skolens-logo.png" alt="Mintofolio Logo" className="navbar-logo" />
          <span className="hidden sm:block mintofolio-text">Mintofolio</span>
        </Link>
        <Link to="/discover" className="hidden sm:block text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">
          Discover
        </Link>
        <Link to="/discover" className="sm:hidden navbar-icon-button text-gray-700 dark:text-gray-300 hover:text-pink-600">
          <Search className="navbar-icon" />
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <Link to="/upload" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 sm:px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition text-sm flex items-center gap-2">
          <Upload className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Add</span>
        </Link>
        <Link to="/profile" className="hidden sm:block text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-pink-600 transition">
          Profile
        </Link>
        <Link to="/profile" className="sm:hidden navbar-icon-button text-gray-700 dark:text-gray-300 hover:text-pink-600">
          <User className="navbar-icon" />
        </Link>
        <button
          onClick={handleLogout}
          className="hidden sm:block ml-2 text-gray-600 dark:text-gray-400 hover:text-red-500 font-semibold text-sm transition"
          disabled={isNavigating}
        >
          {isNavigating ? 'Logging out...' : 'Log out'}
        </button>
        <button
          onClick={handleLogout}
          className="sm:hidden navbar-icon-button text-gray-600 dark:text-gray-400 hover:text-red-500"
          title="Log out"
          disabled={isNavigating}
        >
          {isNavigating ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut className="navbar-icon" />
          )}
        </button>
      </div>
    </nav>
  );
}
