export type ArtStyle = 'pencil' | 'charcoal' | 'watercolor' | 'oil' | 'digital' | 'minimalist';

export interface DrawingLine {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  style: ArtStyle;
  timestamp: number;
}

export interface TestResult {
  name: string;
  status: 'pending' | 'passed' | 'failed';
  message?: string;
}

export interface AppState {
  isRefining: boolean;
  resultImage: string | null;
  error: string | null;
  selectedStyle: ArtStyle;
}
