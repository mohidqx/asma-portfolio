import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type BlogPostType = Tables<"blog_posts">;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data }) => { setPost(data); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  if (!post) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="text-muted-foreground">Post not found</div></div>;

  return (
    <div className="min-h-screen pt-24">
      <article className="section-padding">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-body text-sm mb-8 hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />
          )}

          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at!).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body">{tag}</span>
              ))}
            </div>
          )}

          <div className="prose prose-invert prose-gold max-w-none font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
