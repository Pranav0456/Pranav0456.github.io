export interface DrawingLine {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
}

export interface AppState {
  isRefining: boolean;
  resultImage: string | null;
  error: string | null;
}
