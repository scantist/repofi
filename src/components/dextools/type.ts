export type ChartType =
  | 0 // Bar
  | 1 // Candle
  | 2 // Line
  | 3 // Area
  | 8 // Heikin Ashi
  | 9 // hollow candle
  | 10; // Baseline

export type ChartTheme = "dark" | "light";

export type ChartResolution =
  | "1" // 1 minute
  | "3"
  | "5"
  | "15"
  | "30"
  | "60"
  | "120"
  | "240"
  | "720"
  | "1D" // 1 day
  | "3D" // 3 days
  | "1W" // 1 week
  | "1M"; // 1 month

export type ChartDrawingToolbars = "true" | "false";
