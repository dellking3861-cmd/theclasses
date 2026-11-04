import { Suspense } from "react";
import type { Metadata } from "next";
import { CoursesExplorer } from "./courses-explorer";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Matric (BSEK, AKU-EB, FBISE), Cambridge O Level and Edexcel IGCSE for Grades 9–10; Intermediate (BIEK, AKU-EB, FBISE), Cambridge A Level and Edexcel International A Level for Grades 11–12. Biology, Computer and Arts groups.",
};

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesExplorer />
    </Suspense>
  );
}
