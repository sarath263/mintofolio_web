

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card } from "../../components/ui/card";
import MasonryGrid, { ENABLE_MASONRY_GRID } from "../../components/masonry/MasonryGrid";
import { fetchPexelsImages } from "../../lib/pexels";
import { ImageCanvas}  from "../../lib/pkg/index.jsx";
import Navbar from "../../components/Navbar";
import "./profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState({name: "Evil Rabbit", email: "jjpp@hhss.com"});
  // Images for gallery (fetched from Pexels)
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  useEffect(() => {
    setLoadingImages(true);
    fetchPexelsImages({ perPage: 40, query: "Bohol, Palawan, Philippines, Southeast Asia, water, sunset beach, city breaks, street photography, people portraits, food restaurant public, surreal closeup, wide shot, medium shot, Chinatown, Singapore, Thailand, Vietnam, Malaysia, Indonesia, Cambodia, Laos, Myanmar, Brunei" })
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoadingImages(false));
    
  }, []);
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-16">
      <Navbar />
      {/* Profile Card - Dribbble style */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-8 mb-10 z-10 items-center md:items-start pt-4 sm:pt-8 px-2 sm:px-4 relative">
        {/* Mobile: Popular image as background cover */}
        {/* Find the first Palawan scenic view image, fallback to images[0] */}
        {(images.length > 0) && (() => {
          const palawanImage = images.find(img =>
            (img.alt && /palawan/i.test(img.alt)) ||
            (img.photographer && /palawan/i.test(img.photographer)) ||
            (img.src && /palawan/i.test(img.src))
          ) || images[0];
          return (
            <div className="block md:hidden absolute top-0 left-0 w-full h-1/2 z-0">
              <ImageCanvas im={'v2.jpg'}/>
              
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 w-full h-full profile-mobile-overlay" />
            </div>
          );
        })()}
        {/* Left: Profile Info, open layout */}
        <div className="flex-1 flex flex-col gap-[0.8rem] items-center md:items-start w-full sm:w-auto min-w-0 relative z-10 pt-32 md:pt-0">
          {/* Add a divider for mobile to separate bg and profile info visually */}
          <div className="block md:hidden w-full h-2" />
          <Avatar className="w-28 h-28 mb-2 shadow-lg border-4 border-white">
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mt-1 text-gray-900 dark:text-gray-100">{profile.name}</div>
          <div className="text-lg text-muted-foreground dark:text-gray-400 mb-[0.2rem]">{profile.email}</div>
          <div className="flex flex-wrap gap-[0.6rem] text-base font-medium text-gray-700 dark:text-gray-300 mb-[0.2rem]"> {/* gap-[0.6rem] = 0.20rem * 3 */}
            <span>Turkey</span>
            <span className="opacity-60">|</span>
            <span>Last photo: Turkey</span>
            <span className="opacity-60">|</span>
            <span>Most Used: Sony A7 IV</span>
            <span className="opacity-60">|</span>
            <span>Style: Street, Portrait</span>
          </div>
          <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-[0.2rem]">Gen-Z creative, capturing moments in vibrant cities. Always chasing the next shot. DM for collabs!</div>
          {/* Stats Row */}
          <div className="flex flex-wrap gap-[0.8rem] text-base font-bold text-gray-900 dark:text-gray-100 mb-[0.1rem] items-center justify-center">
            <span className="profile-stats-item"><svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v18M6 9h12M6 15h12" /></svg>₹1,04,500 <span className="profile-stats-label text-gray-500 dark:text-gray-400">Cash</span></span>
            <span className="profile-stats-item"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>2,400 <span className="profile-stats-label text-gray-500 dark:text-gray-400">Tokens</span></span>
            <span className="profile-stats-item"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" /></svg>8,900 <span className="profile-stats-label text-gray-500 dark:text-gray-400">Views</span></span>
            <span className="profile-stats-item"><svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>12 <span className="profile-stats-label text-gray-500 dark:text-gray-400">Streak</span></span>
          </div>
          {/* Main Action Buttons */}
          <div className="flex flex-row gap-[0.6rem] mt-[0.2rem] w-full justify-center flex-wrap">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold text-base shadow-lg hover:scale-105 transition flex-1 min-w-[160px] max-w-xs mb-2 md:mb-0 order-1 md:order-none profile-action-button">
              <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z" /><path d="M12 12V4" /></svg>
              Fan Message
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-full font-semibold shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex-1 min-w-[120px] max-w-xs flex items-center justify-center gap-2 profile-action-button">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" /><path d="M16 6l-4-4-4 4" /></svg>
              Share Profile
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-full font-bold shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex-1 min-w-[120px] max-w-xs flex items-center justify-center gap-2 profile-action-button">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-3-3m3 3l3-3" /></svg>
              Donate
            </button>
          </div>
        </div>
        {/* Right: Most Popular Photo (large, desktop only) */}
        <div className="hidden md:flex flex-1 flex-col gap-4 items-center md:items-end justify-start w-full sm:w-auto min-w-0">
          {/* Find the first Palawan scenic view image, fallback to images[0] */}
          {(images.length > 0) && (() => {
            const palawanImage = images.find(img =>
              (img.alt && /palawan/i.test(img.alt)) ||
              (img.photographer && /palawan/i.test(img.photographer)) ||
              (img.src && /palawan/i.test(img.src))
            ) || images[0];
            return (
              <div className="relative group rounded-2xl overflow-hidden shadow border border-gray-200 w-full max-w-xs sm:max-w-md md:max-w-xl aspect-[4/3] flex items-center justify-center bg-yellow-100 popular-photo-container">
                <img src={palawanImage.src} alt={palawanImage.alt || 'Popular'} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1 popular-photo-badge">PRO <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-4 h-4'><circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.5' fill='none'/><path d='M8 12l2 2 4-4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/></svg></span>
              </div>
            );
          })()}
        </div>
      </div>
      

      {/* Masonry Grid Feature */}
      {ENABLE_MASONRY_GRID && (
        <div className="w-full flex flex-col items-center min-h-[40vh]">
          {loadingImages ? (
            <div className="text-muted-foreground py-12">Loading images...</div>
          ) : (
            <MasonryGrid images={images} onImageClick={(img) => setOpenIdx(images.findIndex(i => i.id === img.id))} />
          )}
        </div>
      )}

      {/* Expandable Gallery Feature removed */}
    </div>
  );
} 