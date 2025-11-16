

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
      
      // Preview the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Preview(reader.result);
      };
      reader.readAsDataURL(file);
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
        
        console.log('result:',result.data?.base64_data);
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
              Select Image File
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* File Preview */}
          {base64Preview && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview:</label>
              <img 
                src={base64Preview} 
                alt="Preview" 
                className="max-w-full h-auto max-h-64 rounded-md border"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload to API'}
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
