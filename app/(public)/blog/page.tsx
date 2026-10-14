import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "ai-transforming-education-pakistan",
    title: "How AI is Transforming Education in Pakistan",
    excerpt: "Discover how artificial intelligence is reshaping the way students learn and teachers teach in Pakistani classrooms.",
    category: "Technology",
    date: "2026-06-15",
    readTime: "5 min read",
  },
  {
    slug: "cambridge-exam-preparation-tips",
    title: "Top 10 Tips for Cambridge Exam Preparation",
    excerpt: "Expert strategies from our faculty to help you ace your Cambridge O and A Level examinations.",
    category: "Exam Tips",
    date: "2026-06-10",
    readTime: "8 min read",
  },
  {
    slug: "choosing-right-coaching-center",
    title: "Choosing the Right Coaching Center in Karachi",
    excerpt: "A comprehensive guide for parents and students on selecting the best coaching center for academic success.",
    category: "Guide",
    date: "2026-06-05",
    readTime: "6 min read",
  },
  {
    slug: "hybrid-learning-benefits",
    title: "The Benefits of Hybrid Learning Models",
    excerpt: "Why combining physical and online education delivers better outcomes for modern students.",
    category: "Education",
    date: "2026-05-28",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  return (
    <section className="py-16 bg-[#fefce8] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Blog</h1>
          <p className="mt-3 text-lg text-slate-600">
            Insights, tips, and updates from The Classes team.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Card key={post.slug} hover className="card-3d border-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="info">{post.category}</Badge>
                  <span className="text-xs text-slate-500">{post.readTime}</span>
                </div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{formatDate(post.date)}</span>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-yellow-600 hover:text-yellow-800 flex items-center gap-1">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
