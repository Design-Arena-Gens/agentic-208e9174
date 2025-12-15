export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  originalName: string;
  timestamp: number;
}

export interface TransformResponse {
  success: boolean;
  processedImageUrl?: string;
  error?: string;
}
