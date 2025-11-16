// http.js
const baseUrl="http://localhost:3000";
export async function fetchIt(url, options = {}) {
  try {
    const {
      method = "GET",
      headers = {},
      body = null,
      parse = "json", // "json" | "text" | "blob" etc.
      timeout = 10000, // in ms
    } = options;

    // timeout support
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(baseUrl+url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    switch (parse) {
      case "text":
        return await response.text();
      case "blob":
        return await response.blob();
      case "json":
      default:
        return await response.json();
    }
  } catch (err) {
    throw new Error(`Fetch failed: ${err.message}`);
  }
}


// Utility function to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1]; // remove data:image/...;base64,
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Utility function to upload image to API
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Utility function to get image by filename
export const getImageByFilename = async (filename) => {
  try {
    const response = await fetch(`/api/get/${encodeURIComponent(filename)}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve image: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get image error:', error);
    throw error;
  }
};