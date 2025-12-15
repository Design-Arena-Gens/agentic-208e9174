"use client";

import { useState, useRef, ChangeEvent } from "react";
import { ProcessedImage } from "../types";

interface ImageUploaderProps {
  onImagesProcessed: (images: ProcessedImage[]) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export default function ImageUploader({
  onImagesProcessed,
  isProcessing,
  setIsProcessing,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [location, setLocation] = useState("");
  const [dealershipName, setDealershipName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }

    if (!location.trim()) {
      alert("Please enter the location or waterway");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const processedImages: ProcessedImage[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setCurrentImage(file.name);
      setProgress(((i + 1) / selectedFiles.length) * 100);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("location", location);
      formData.append("dealershipName", dealershipName);

      try {
        const response = await fetch("/api/transform", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          processedImages.push({
            id: `${Date.now()}-${i}`,
            originalUrl: URL.createObjectURL(file),
            processedUrl: data.processedImageUrl,
            originalName: file.name,
            timestamp: Date.now(),
          });
        } else {
          console.error(`Failed to process ${file.name}:`, data.error);
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      }
    }

    onImagesProcessed(processedImages);
    setIsProcessing(false);
    setSelectedFiles([]);
    setProgress(0);
    setCurrentImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Boat Images (Multiple files supported)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
            disabled={isProcessing}
          />
          {selectedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Location / Waterway *
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Miami Marina, Lake Tahoe, Caribbean waters"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Dealership Name (Optional)
          </label>
          <input
            type="text"
            value={dealershipName}
            onChange={(e) => setDealershipName(e.target.value)}
            placeholder="e.g., Sunset Yacht Sales"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
            disabled={isProcessing}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={isProcessing || selectedFiles.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing... {Math.round(progress)}%
            </span>
          ) : (
            "Transform Images"
          )}
        </button>

        {isProcessing && currentImage && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Currently processing: {currentImage}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
