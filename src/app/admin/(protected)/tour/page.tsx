import { getTourDates } from "@/lib/data";
import TourAdmin from "@/components/admin/TourAdmin";

export default function AdminTourPage() {
  const dates = getTourDates();
  return <TourAdmin initialDates={dates} />;
}
