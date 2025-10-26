export const ASPECT_RATIOS = ["9:16", "16:9", "1:1", "3:4", "4:3"] as const;

export type AspectRatio = typeof ASPECT_RATIOS[number];
