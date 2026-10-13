import { PageHeader, EmptyState } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherTimetablePage() {
  return (
    <div>
      <PageHeader title="Timetable" description="Manage your class schedule" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => (
          <Card key={day}>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">{day}</h3>
              <EmptyState icon={Calendar} title="No classes" description={`No classes scheduled for ${day}.`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
