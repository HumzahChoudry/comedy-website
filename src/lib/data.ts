import fs from "fs";
import path from "path";
import { SiteConfig, Photo, Video, TourDate } from "@/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getSiteConfig(): SiteConfig {
  return readJSON<SiteConfig>("site-config.json");
}

export function saveSiteConfig(config: SiteConfig): void {
  writeJSON("site-config.json", config);
}

export function getPhotos(): Photo[] {
  return readJSON<Photo[]>("photos.json");
}

export function savePhotos(photos: Photo[]): void {
  writeJSON("photos.json", photos);
}

export function getVideos(): Video[] {
  return readJSON<Video[]>("videos.json");
}

export function saveVideos(videos: Video[]): void {
  writeJSON("videos.json", videos);
}

export function getTourDates(): TourDate[] {
  const dates = readJSON<TourDate[]>("tour-dates.json");
  return dates.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function saveTourDates(dates: TourDate[]): void {
  writeJSON("tour-dates.json", dates);
}

export function getYouTubeEmbedUrl(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export function getYouTubeThumbnail(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return "";
}
