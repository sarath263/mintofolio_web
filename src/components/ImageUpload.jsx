

import { useState } from 'react';
import { uploadImage, fileToBase64 } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [base64Preview, setBase64Preview] = useState(null);
  const [iframePreviewUrl, setIframePreviewUrl] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
      setIframePreviewUrl(null);

      // Preview the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Preview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlFetch = async () => {
    if (!urlInput) {
      setError('Please enter a valid URL');
      return;
    }

    setFetchingUrl(true);
    setError(null);
    setUploadResult(null);

    try {
      let finalUrl = urlInput;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }

      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(finalUrl)}&screenshot=true&meta=false`);
      const data = await response.json();

      if (data.status === 'success' && data.data.screenshot) {
        const imageUrl = data.data.screenshot.url;

        // Show the preview using an iframe instead of the screenshot image
        setBase64Preview(null);
        setIframePreviewUrl(finalUrl);

        // Fetch the actual image blob via a CORS proxy to create an uploadable File object
        const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(imageUrl);
        const imgResponse = await fetch(proxyUrl);
        if (!imgResponse.ok) throw new Error("Failed to proxy image for upload");

        const blob = await imgResponse.blob();
        const file = new File([blob], "screenshot.png", { type: "image/png" });

        setSelectedFile(file);
      } else {
        throw new Error("Failed to generate screenshot. Ensure the URL is accessible.");
      }
    } catch (err) {
      setError('Failed to fetch screenshot: ' + err.message);
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload to API
      const result = await uploadImage(selectedFile);
      setUploadResult(result);

      // Optionally process with WASM
      if (result.data?.base64_data) {

        console.log('result:', result.data?.base64_data);
      }

    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleConvertToBase64 = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      const base64 = await fileToBase64(selectedFile);
      console.log('Base64 string (first 100 chars):', base64.substring(0, 100));
      alert(`Base64 conversion complete! Check console for preview. Length: ${base64.length} characters`);
    } catch (err) {
      setError('Failed to convert to base64: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
              Select File : Images and pdfs are supported.
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
            />
          </div>

          <div className="flex items-center">
            <hr className="flex-1 border-gray-300 dark:border-gray-600" />
            <span className="px-3 text-sm text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium mb-2">
              Enter Web URL
            </label>
            <div className="flex gap-2">
              <input
                id="url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/mycontent"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch()}
              />
              <Button onClick={handleUrlFetch} disabled={fetchingUrl || !urlInput} type="button">
                {fetchingUrl ? 'Fetching...' : 'Fetch'}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {(base64Preview || iframePreviewUrl) && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview:</label>
              {base64Preview ? (
                <img
                  src={base64Preview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded-md border"
                />
              ) : (
                <iframe
                  src={iframePreviewUrl}
                  title="URL Preview"
                  className="w-full h-64 border border-gray-300 dark:border-gray-600 rounded-md bg-white zoomAndFix"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full mt-6">
            <Button
              size="lg"
              className="w-full text-lg py-7 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Uploading...
                </span>
              ) : 'Add to Portfolio'}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-300 rounded-md">
              <h4 className="font-semibold">Upload Successful!</h4>
              <p>File: {uploadResult.data.filename}</p>
              <p>Size: {(uploadResult.data.fileSize / 1024).toFixed(2)} KB</p>
              <p>Type: {uploadResult.data.fileType}</p>
              <p>ID: {uploadResult.data.id}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
