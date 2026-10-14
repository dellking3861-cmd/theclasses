import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import type { Metadata } from "next";

interface Params {
  slug: string;
}

const SANITIZE_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h3", "h4", "h5", "h6"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height"],
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, slug, excerpt, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} | The Classes Blog`,
    description: post.excerpt || "Read the latest insights from The Classes Education System.",
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, category, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const cleanContent = sanitizeHtml(post.content, SANITIZE_OPTIONS);

  return (
    <section className="py-16 bg-[#fefce8] min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-yellow-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <article>
          <div className="mb-6 space-y-3">
            <Badge variant="info" className="text-xs">{post.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.published_at ? formatDate(post.published_at) : "Soon"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                5 min read
              </span>
            </div>
          </div>

          <p className="text-lg text-slate-600 border-l-4 border-yellow-400 pl-4 italic mb-8">
            {post.excerpt}
          </p>

          <div className="prose prose-lg prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: cleanContent }} />
        </article>

        <div className="mt-12 pt-8 border-t border-yellow-200">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Interested in learning more? Apply Now
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
