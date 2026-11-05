import { requireAuth } from "@/lib/auth";
import { StudentLibrary } from "@/components/resources/student-library";
import { loadStudentResources } from "@/lib/student-resources";

export const metadata = { title: "Notes & Past Papers" };

export default async function StudentNotesPage() {
  const user = await requireAuth("student");
  const { items, profile } = await loadStudentResources(user.id, "files");
  return <StudentLibrary mode="files" items={items} profile={profile} />;
}
