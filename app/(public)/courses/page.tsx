import type { Metadata } from "next";
import { CoursesExplorer } from "./courses-explorer";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Matric (BSEK, AKU-EB, FBISE), Cambridge O Level and Edexcel IGCSE for Grades 9–10; Intermediate (BIEK, AKU-EB, FBISE), Cambridge A Level and Edexcel International A Level for Grades 11–12. Biology, Computer and Arts groups.",
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  return <CoursesExplorer query={{ stage: first(sp.stage), board: first(sp.board), subject: first(sp.subject) }} />;
}
