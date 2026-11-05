import { requireAuth } from "@/lib/auth";
import { StudentLibrary } from "@/components/resources/student-library";
import { loadStudentResources } from "@/lib/student-resources";

export const metadata = { title: "Recorded Lectures" };

export default async function StudentLecturesPage() {
  const user = await requireAuth("student");
  const { items, profile } = await loadStudentResources(user.id, "lectures");
  return <StudentLibrary mode="lectures" items={items} profile={profile} />;
}
