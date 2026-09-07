import { getPhotos } from "@/lib/data";
import PhotosAdmin from "@/components/admin/PhotosAdmin";

export default function AdminPhotosPage() {
  const photos = getPhotos();
  return <PhotosAdmin initialPhotos={photos} />;
}
