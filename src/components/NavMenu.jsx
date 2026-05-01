import { useState, useRef, useEffect } from "react";
import { MoreVertical, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export default function NavMenu({ handleLogout, isNavigating }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  const currentThemeIndex = mounted ? themes.findIndex(t => t.value === theme) : 2;
  // Fallback to system if not found
  const validIndex = currentThemeIndex !== -1 ? currentThemeIndex : 2;
  const currentTheme = themes[validIndex];
  const CurrentIcon = currentTheme.icon;

  const handleThemeCycle = (e) => {
    e.stopPropagation(); // keep menu open when cycling theme
    const nextIndex = (validIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center focus:outline-none"
        title="More options"
      >
        <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 transform origin-top-right transition-all flex flex-col">
          
          <button
            onClick={handleThemeCycle}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {mounted ? <CurrentIcon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              <span>Theme</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
              {mounted ? currentTheme.label : 'System'}
            </span>
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 w-full" />

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            disabled={isNavigating}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            {isNavigating ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  );
}
