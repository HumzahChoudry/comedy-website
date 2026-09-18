import { getEmailSignups } from "@/lib/data";
import SubscribersAdmin from "@/components/admin/SubscribersAdmin";

export default async function AdminSubscribersPage() {
  const signups = await getEmailSignups();
  return <SubscribersAdmin initialSignups={signups} />;
}
