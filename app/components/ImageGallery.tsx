"use client";

import { ProcessedImage } from "../types";
import { useState } from "react";

interface ImageGalleryProps {
  images: ProcessedImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `transformed_${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Transformed Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="aspect-video relative">
                <img
                  src={image.processedUrl}
                  alt={image.originalName}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold"
                  >
                    View Full Size
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium truncate">{image.originalName}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => downloadImage(image.processedUrl, image.originalName)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-7xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300"
            >
              ×
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Original</h3>
                <img
                  src={selectedImage.originalUrl}
                  alt="Original"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">Transformed</h3>
                <img
                  src={selectedImage.processedUrl}
                  alt="Transformed"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => downloadImage(selectedImage.processedUrl, selectedImage.originalName)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Download Transformed Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
