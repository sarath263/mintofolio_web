
import { useEffect, useState, useCallback } from "react";
import MasonryGrid, { ENABLE_MASONRY_GRID } from "../../components/masonry/MasonryGrid";
import { fetchPexelsImages } from "../../lib/pexels";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import Navbar from "../../components/Navbar";
import "./discover.css";

export default function DiscoverPage() {
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [search, setSearch] = useState("");
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightValue, setSpotlightValue] = useState("");

  // Keyboard shortcut for Cmd+U or Cmd+K
  useEffect(() => {
    const handler = (e) => {
      // Open/close on Cmd+U or Cmd+K
      if ((e.metaKey && (e.key === "u" || e.key === "k"))) {
        e.preventDefault();
        setShowSpotlight((prev) => !prev);
      }
      // Close on Escape
      if (e.key === "Escape") {
        setShowSpotlight(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Spotlight search submit
  const handleSpotlightSubmit = useCallback((e) => {
    e.preventDefault();
    setSearch(spotlightValue);
    setShowSpotlight(false);
  }, [spotlightValue]);

  useEffect(() => {
    setLoadingImages(true);
    fetchPexelsImages({ perPage: 40, query: search || "travel, world, people, city, food, nature, adventure, product, topic" })
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoadingImages(false));
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 pt-24">
      <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-gray-900 dark:text-gray-100">Discover the world through photos</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        {['Recommended for you','12 hours ago','Taken Today','This week','Sunsets','Portraits','Mountains','Rivers','Lake','Beaches','City Lights','Forests','Flowers','Street','Food','Chinatown','Temples','Night Sky','Waterfalls'].map(tag => (
          <button key={tag} onClick={()=>setSearch(tag.toLowerCase())} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-gray-700 dark:text-gray-300 font-semibold text-sm transition">{tag}</button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          {/* ...existing code for MasonryGrid... */}
          {ENABLE_MASONRY_GRID && (
            <div className="w-full flex flex-col items-center min-h-[40vh]">
              {loadingImages ? (
                <div className="text-muted-foreground py-12">Loading images...</div>
              ) : (
                <MasonryGrid 
                  images={images.map(img => ({
                    ...img,
                    avatar: img.photographer_url || "https://github.com/evilrabbit.png",
                    name: img.photographer || "Photographer"
                  }))}
                  onImageClick={()=>{}}
                  showAvatarOnHover
                />
              )}
            </div>
          )}
        </div>
        {/* Filters sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4 mt-4 md:mt-0">
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-800">
            <div className="font-bold text-gray-700 dark:text-gray-300 mb-2">Filters</div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Camera Type</div>
              <div className="flex flex-wrap gap-2">
                {["Sony A7 IV","Canon R5","iPhone","Fujifilm","Nikon Z6","Leica"].map(cam => (
                  <button key={cam} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-xs font-medium text-gray-700 dark:text-gray-300 transition">{cam}</button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Shot Type</div>
              <div className="flex flex-wrap gap-2">
                {["Portrait","Landscape","Street","Food","Night","Macro"].map(type => (
                  <button key={type} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-xs font-medium text-gray-700 dark:text-gray-300 transition">{type}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Color Grade</div>
              <div className="flex flex-wrap gap-2">
                {["#f87171","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6","#111827","#f3f4f6"].map(color => (
                  <button 
                    key={color} 
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow color-grade-button" 
                    style={{"--color-value": color}}
                    title={color}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
      {/* Spotlight Search Modal */}
      {showSpotlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSpotlightSubmit}
            className="relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 rounded-2xl flex flex-col items-center w-full max-w-xl p-0 spotlight-modal"
          >
            <input
              autoFocus
              type="text"
              value={spotlightValue}
              onChange={e=>setSpotlightValue(e.target.value)}
              placeholder="Search beautiful topics..."
              className="w-full px-8 py-6 rounded-2xl border-none text-2xl font-semibold bg-white/40 dark:bg-zinc-900/40 shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-400/30 placeholder:font-normal placeholder:text-gray-400 transition-all duration-300 spotlight-input"
              onKeyDown={e => {
                if (e.key === 'Escape') setShowSpotlight(false);
              }}
            />
            {/* Animated search suggestions placeholder */}
            {spotlightValue && (
              <div className="w-full px-4 pt-2 pb-4">
                <div className="animate-fade-in-up transition-all duration-300 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-lg mt-2">
                  <div className="p-4 text-gray-500 text-base font-medium">Suggestions coming soon...</div>
                </div>
              </div>
            )}
            <div className="absolute top-2 right-4 text-xs text-gray-400 select-none">Shortcut: <kbd className="px-1 py-0.5 keyboard-shortcut">⌘</kbd>+<kbd className="px-1 py-0.5 keyboard-shortcut">U</kbd> / <kbd className="px-1 py-0.5 bg-gray-200 rounded">K</kbd> &nbsp;|&nbsp; <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> to close</div>
          </form>
        </div>
      )}
      {ENABLE_MASONRY_GRID && (
        <div className="w-full flex flex-col items-center min-h-[40vh]">
          {loadingImages ? (
            <div className="text-muted-foreground py-12">Loading images...</div>
          ) : (
            <MasonryGrid 
              images={images.map(img => ({
                ...img,
                // Add avatar and name for hover
                avatar: img.photographer_url || "https://github.com/evilrabbit.png",
                name: img.photographer || "Photographer"
              }))}
              onImageClick={()=>{}}
              showAvatarOnHover
            />
          )}
        </div>
      )}
    </div>
    </>
  );
}
