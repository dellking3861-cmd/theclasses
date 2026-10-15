import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog | The Classes",
  description: "Insights, tips, and updates from The Classes Education System.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, category, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <section className="min-h-screen bg-stone-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-bold text-stone-900 font-display">Blog</h1>
          <p className="mt-3 text-lg text-stone-500">
            Insights, tips, and updates from The Classes team.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500">New articles coming soon. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="border-stone-100 hover:border-amber-200 hover:shadow-md transition-all bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="info" className="text-xs">{post.category}</Badge>
                    <span className="text-xs text-stone-400">5 min read</span>
                  </div>
                  <CardTitle className="text-xl font-display text-stone-900">{post.title}</CardTitle>
                  <CardDescription className="text-stone-500 line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-400">
                      {post.published_at ? formatDate(post.published_at) : "Recent"}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
                    >
                      Read More{" "}
                      <ArrowRight className="h-4 w-4 transform group-hover:translateX-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
