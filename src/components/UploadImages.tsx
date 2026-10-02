'use client';

import { useState } from 'react';

interface UploadImagesProps {
  multiple?: boolean;
  onUpload: (files: FileList) => void;
  initialUrls?: string[];
}

export const UploadImages = ({ 
  multiple = false, 
  onUpload, 
  initialUrls = [] 
}: UploadImagesProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>(initialUrls);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
      // Create previews for selected files
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews([...initialUrls, ...newPreviews]);
    }
  };

  const handleUpload = () => {
    if (selectedFiles) {
      onUpload(selectedFiles);
      // Clear after upload
      setSelectedFiles(null);
      setPreviews(initialUrls);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
      />
      {selectedFiles && (
        <button onClick={handleUpload}>
          Uploader {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}
        </button>
      )}
      <div>
        {previews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index}`} style={{ maxWidth: '200px', margin: '10px' }} />
        ))}
      </div>
    </div>
  );
};