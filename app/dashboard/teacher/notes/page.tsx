import { requireAuth } from "@/lib/auth";
import { ResourceManager } from "@/components/resources/resource-manager";

export const metadata = { title: "Notes & Past Papers" };

export default async function TeacherNotesPage() {
  const user = await requireAuth("teacher");
  return <ResourceManager role="teacher" userId={user.id} initialTab="files" />;
}
