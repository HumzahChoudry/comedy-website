import { getVideos } from "@/lib/data";
import VideosAdmin from "@/components/admin/VideosAdmin";

export default async function AdminVideosPage() {
  const videos = await getVideos();
  return <VideosAdmin initialVideos={videos} />;
}
