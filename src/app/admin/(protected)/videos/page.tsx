import { getVideos } from "@/lib/data";
import VideosAdmin from "@/components/admin/VideosAdmin";

export default function AdminVideosPage() {
  const videos = getVideos();
  return <VideosAdmin initialVideos={videos} />;
}
