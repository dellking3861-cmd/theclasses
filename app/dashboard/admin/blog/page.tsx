"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const CATEGORIES = ["Technology", "Exam Tips", "Guide", "Education", "News", "Events"];

export default function BlogAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "Education", is_published: false });

  const supabase = createClient();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const slug = form.slug.trim() || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    if (editingId) {
      const { error } = await supabase.from("posts").update({ ...form, slug }).eq("id", editingId);
      if (error) { toast.error(error.message); return; }
      toast.success("Post updated");
    } else {
      const { error } = await supabase.from("posts").insert([{ ...form, slug }]);
      if (error) { toast.error(error.message); return; }
      toast.success("Post created");
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", category: "Education", is_published: false });
    loadPosts();
  }

  async function togglePublish(post: Post) {
    const { error } = await supabase.from("posts").update({ is_published: !post.is_published }).eq("id", post.id);
    if (error) { toast.error(error.message); return; }
    loadPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Post deleted");
    loadPosts();
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt ?? "", content: post.content, category: post.category ?? "Education", is_published: post.is_published });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage blog posts</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: "", slug: "", excerpt: "", content: "", category: "Education", is_published: false }); }} className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {showForm && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Post" : "Create Post"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="title" placeholder="Post title *" value={form.title} onChange={handleInputChange} />
            <Input name="slug" placeholder="URL slug (auto-generated if empty)" value={form.slug} onChange={handleInputChange} />
            <Textarea name="excerpt" placeholder="Brief excerpt for SEO" value={form.excerpt} onChange={handleInputChange} />
            <select name="category" value={form.category} onChange={handleInputChange} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <Textarea name="content" placeholder="Post content (HTML supported) *" rows={10} value={form.content} onChange={handleInputChange} />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded" />
                {form.is_published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
                Publish immediately
              </label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600">Save Post</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No posts yet. Create your first one!</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="border-yellow-50">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.is_published && <Badge variant="success" className="text-xs">Published</Badge>}
                    {!post.is_published && <Badge variant="warning" className="text-xs">Draft</Badge>}
                    <Badge variant="info" className="text-xs">{post.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
                  <p className="text-xs text-slate-400 mt-1">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => startEdit(post)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => togglePublish(post)}>
                    {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
