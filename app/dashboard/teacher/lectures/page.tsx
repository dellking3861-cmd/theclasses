import { requireAuth } from "@/lib/auth";
import { ResourceManager } from "@/components/resources/resource-manager";

export const metadata = { title: "Video Lectures" };

export default async function TeacherLecturesPage() {
  const user = await requireAuth("teacher");
  return <ResourceManager role="teacher" userId={user.id} initialTab="lecture" />;
}
