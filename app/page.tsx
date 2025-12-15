"use client";

import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ImageGallery from "./components/ImageGallery";
import { ProcessedImage } from "./types";

export default function Home() {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImagesProcessed = (newImages: ProcessedImage[]) => {
    setProcessedImages((prev) => [...prev, ...newImages]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Boat Image Transformer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your boat trailer photos into stunning professional shots in water.
            Our AI removes trailers, adds realistic water environments, and creates magazine-quality images.
          </p>
        </div>

        <ImageUploader
          onImagesProcessed={handleImagesProcessed}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />

        {processedImages.length > 0 && (
          <ImageGallery images={processedImages} />
        )}

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎨 Automatic Background Removal</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI removes trailers, props, and unwanted background objects
              </p>
            </div>
            <div className="p-4 bg-cyan-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🌊 Realistic Water Placement</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Places boats in beautiful local waterways with natural reflections
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📸 Professional Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Zoom lens effects, wide-angle interiors, and proper boat proportions
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
