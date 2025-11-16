import React, { useRef, useState, useCallback } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import PropTypes from "prop-types";
import "./MasonryGrid.css";

// Feature flag for easy removal
export const ENABLE_MASONRY_GRID = true;

const MasonryGrid = ({ images, onImageClick, batchSize = 12, showAvatarOnHover = false }) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loadMoreRef = useRef(null);
  const isLoadMoreInView = useInView(loadMoreRef, { once: false, margin: "0px" });

  // Load more images when the sentinel is in view
  React.useEffect(() => {
    if (isLoadMoreInView && visibleCount < images.length) {
      setVisibleCount((prev) => Math.min(prev + batchSize, images.length));
    }
  }, [isLoadMoreInView, visibleCount, images.length, batchSize]);

  // Animation controls for fade-in on scroll
  const controls = useAnimation();
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: false, margin: "-100px" });
  React.useEffect(() => {
    if (gridInView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0.5, y: 40 });
    }
  }, [gridInView, controls]);

  // Even-odd grid effect: alternate columns for visual interest
  const getColumnClass = useCallback((idx) => {
    return idx % 2 === 0 ? "" : "md:mt-8";
  }, []);

  // Use real aspect ratio if available, fallback to portrait/landscape
  const getAspectClass = useCallback((img) => {
    if (img.width && img.height) {
      const ratio = img.width / img.height;
      if (ratio > 1.2) return "aspect-[4/3] md:aspect-[4/3]"; // landscape
      if (ratio < 0.9) return "aspect-[3/4] md:aspect-[3/4]"; // portrait
      return "aspect-square md:aspect-square";
    }
    // fallback: portrait for even, landscape for odd
    return img.id % 2 === 0 ? "aspect-[3/4] md:aspect-[3/4]" : "aspect-[4/3] md:aspect-[4/3]";
  }, []);

  // Pastel color palette for placeholders
  const pastelColors = [
    "#f8e1e7", "#e1f8f2", "#e1e7f8", "#f8f3e1", "#e1f8e7", "#f8e1f3", "#e1f3f8", "#f3e1f8"
  ];

  // Track loaded images for fade-in
  const [loaded, setLoaded] = useState({});
  // Track if all placeholders are loaded before images fade in
  const [placeholdersReady, setPlaceholdersReady] = useState(false);

  // Scroll opacity animation for each grid item
  const itemRefs = useRef([]);
  const [itemInView, setItemInView] = useState({});

  // Observe each item for scroll opacity and animation
  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, visibleCount);
    let readyCount = 0;
    itemRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          setItemInView((prev) => ({ ...prev, [idx]: entry.isIntersecting }));
        },
        { threshold: 0.1 }
      );
      observer.observe(ref);
      readyCount++;
      return () => observer.disconnect();
    });
    if (readyCount === images.slice(0, visibleCount).length) {
      setTimeout(() => setPlaceholdersReady(true), 200);
    }
  }, [visibleCount, images]);

  // Mix portrait and landscape images for a visually appealing start
  const imagesWithRatio = images.map(img => {
    let ratio = 1;
    if (img.width && img.height) ratio = img.width / img.height;
    return { ...img, _ratio: ratio };
  });
  const portraits = imagesWithRatio.filter(img => img._ratio < 0.95);
  const landscapes = imagesWithRatio.filter(img => img._ratio > 1.05);
  const squares = imagesWithRatio.filter(img => img._ratio >= 0.95 && img._ratio <= 1.05);
  // Interleave: portrait, landscape, square, repeat
  const mixed = [];
  let p = 0, l = 0, s = 0;
  for (let i = 0; i < imagesWithRatio.length; i++) {
    if (p < portraits.length) { mixed.push(portraits[p++]); }
    if (l < landscapes.length) { mixed.push(landscapes[l++]); }
    if (s < squares.length) { mixed.push(squares[s++]); }
    if (mixed.length >= visibleCount) break;
  }
  // If not enough, fill with remaining
  while (mixed.length < visibleCount) {
    if (p < portraits.length) mixed.push(portraits[p++]);
    else if (l < landscapes.length) mixed.push(landscapes[l++]);
    else if (s < squares.length) mixed.push(squares[s++]);
    else break;
  }

  return (
    <div
      ref={gridRef}
      className="w-full max-w-full mx-auto px-4 md:px-8 columns-2 sm:columns-2 md:columns-3 [column-gap:0.5rem] masonry-grid"
    >
      {mixed.map((img, idx) => {
        const pastel = pastelColors[idx % pastelColors.length];
        return (
          <motion.div
            key={img.id || idx}
            ref={el => (itemRefs.current[idx] = el)}
            className={
              "break-inside-avoid overflow-hidden bg-white cursor-pointer relative flex flex-col justify-center items-center mb-2 group masonry-grid-item"
            }
            data-opacity={itemInView[idx] ? 1 : 0.5}
            onClick={() => onImageClick(img)}
            initial={{ opacity: 0, y: 32 }}
            animate={itemInView[idx] ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.32, delay: idx * 0.02, type: 'spring', stiffness: 120, damping: 18 }}
          >
            <motion.div
              className="w-full h-full masonry-grid-item-placeholder"
              initial={{ opacity: 1 }}
              animate={{ opacity: placeholdersReady ? 1 : 1 }}
            />
            <motion.img
              src={img.src}
              alt={img.alt || `Image ${idx + 1}`}
              className="w-full object-cover block transition-opacity duration-700 masonry-grid-image"
              loading="lazy"
              data-opacity={loaded[idx] && placeholdersReady ? 1 : 0}
              onLoad={() => setLoaded(l => ({ ...l, [idx]: true }))}
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded[idx] && placeholdersReady ? 1 : 0 }}
              transition={{ duration: 0.7, delay: placeholdersReady ? 0.1 : 0 }}
            />
            {/* Avatar/name on hover */}
            {showAvatarOnHover && (img.avatar || img.name) && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 dark:bg-gray-900/90 rounded-full px-2 py-1 shadow border border-gray-200 dark:border-gray-700">
                {img.avatar && (
                  <img src={img.avatar} alt={img.name || "avatar"} className="w-7 h-7 rounded-full border border-pink-400 object-cover" />
                )}
                {img.name && (
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{img.name}</span>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
      {/* Infinite scroll sentinel */}
      {visibleCount < images.length && (
        <div ref={loadMoreRef} className="h-8 w-full" />
      )}
    </div>
  );
};

MasonryGrid.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      avatar: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  onImageClick: PropTypes.func,
  batchSize: PropTypes.number,
  showAvatarOnHover: PropTypes.bool,
};

MasonryGrid.defaultProps = {
  onImageClick: () => {},
  batchSize: 12,
  showAvatarOnHover: false,
};

export default MasonryGrid;
