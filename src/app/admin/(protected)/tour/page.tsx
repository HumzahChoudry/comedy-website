import { getTourDates } from "@/lib/data";
import TourAdmin from "@/components/admin/TourAdmin";

export default async function AdminTourPage() {
  const dates = await getTourDates();
  return <TourAdmin initialDates={dates} />;
}
