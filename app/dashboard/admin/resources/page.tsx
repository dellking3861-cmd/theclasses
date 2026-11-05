import { requireAuth } from "@/lib/auth";
import { ResourceManager } from "@/components/resources/resource-manager";

export const metadata = { title: "Study Materials" };

export default async function AdminResourcesPage() {
  const user = await requireAuth("admin");
  return <ResourceManager role="admin" userId={user.id} />;
}
