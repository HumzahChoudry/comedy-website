import { getPhotos } from "@/lib/data";
import PhotosAdmin from "@/components/admin/PhotosAdmin";

export default async function AdminPhotosPage() {
  const photos = await getPhotos();
  return <PhotosAdmin initialPhotos={photos} />;
}
