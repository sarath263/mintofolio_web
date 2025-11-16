import { fetchIt } from "./api";

// Utility to fetch random images from Pexels API
export const PEXELS_API_KEY = "FJqnSrUqqIcK5tyFHUUPA1Upz9QKTjRmhxR6TRcozLWtzpee73aG818f";

export async function fetchPexelsImages({ perPage = 12, query = "nature" } = {}) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;
  const res = await fetchIt(url, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });
  if (!res.photos.length) throw new Error("Failed to fetch images from Pexels");

  return (res.photos || []).map(photo => ({
    id: photo.id,
    src: photo.src.large,
    alt: photo.alt || photo.photographer,
  }));
}
