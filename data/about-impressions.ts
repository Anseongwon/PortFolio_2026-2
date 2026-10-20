export const ABOUT_IMPRESSION_OPTIONS = [
  { key: "steady", label: "꾸준함" },
  { key: "sincere", label: "성실함" },
  { key: "curious", label: "호기심" },
  { key: "calm", label: "차분함" },
  { key: "collaborative", label: "협업" },
] as const;

export type AboutImpressionKey =
  (typeof ABOUT_IMPRESSION_OPTIONS)[number]["key"];
