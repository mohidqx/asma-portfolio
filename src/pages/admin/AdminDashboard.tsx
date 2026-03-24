import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Briefcase, MessageSquare, Users, Eye, Mail, PenTool, Image } from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  blogPosts: number;
  projects: number;
  testimonials: number;
  feedbacks: number;
  visitors: number;
  messages: number;
  unreadMessages: number;
  pendingFeedbacks: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0, projects: 0, testimonials: 0, feedbacks: 0,
    visitors: 0, messages: 0, unreadMessages: 0, pendingFeedbacks: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [blog, proj, test, feed, vis, msg, unread, pending] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("feedbacks").select("id", { count: "exact", head: true }),
        supabase.from("visitor_logs").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
        supabase.from("feedbacks").select("id", { count: "exact", head: true }).eq("approved", false),
      ]);
      setStats({
        blogPosts: blog.count || 0,
        projects: proj.count || 0,
        testimonials: test.count || 0,
        feedbacks: feed.count || 0,
        visitors: vis.count || 0,
        messages: msg.count || 0,
        unreadMessages: unread.count || 0,
        pendingFeedbacks: pending.count || 0,
      });
    };

    const fetchRecent = async () => {
      const { data } = await supabase
        .from("visitor_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentVisitors(data || []);
    };

    fetchStats();
    fetchRecent();
  }, []);

  const cards = [
    { label: "Total Visitors", value: stats.visitors, icon: Eye, link: "/admin/visitors", color: "text-teal-glow" },
    { label: "Blog Posts", value: stats.blogPosts, icon: PenTool, link: "/admin/blog", color: "text-primary" },
    { label: "Projects", value: stats.projects, icon: Briefcase, link: "/admin/projects", color: "text-primary" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, link: "/admin/testimonials", color: "text-primary" },
    { label: "Feedbacks", value: stats.feedbacks, icon: Users, link: "/admin/feedbacks", badge: stats.pendingFeedbacks, color: "text-primary" },
    { label: "Messages", value: stats.messages, icon: Mail, link: "/admin/messages", badge: stats.unreadMessages, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-gradient-gold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={card.color} size={24} />
              {card.badge ? (
                <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">{card.badge} pending</span>
              ) : null}
            </div>
            <div className="text-3xl font-display font-bold text-foreground">{card.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Visitors */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Recent Visitors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Page</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Browser</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">OS</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Device</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentVisitors.map((v) => (
                <tr key={v.id} className="border-b border-border/10">
                  <td className="py-2 text-foreground">{v.page_path}</td>
                  <td className="py-2 text-muted-foreground">{v.browser}</td>
                  <td className="py-2 text-muted-foreground">{v.os}</td>
                  <td className="py-2 text-muted-foreground">{v.device_type}</td>
                  <td className="py-2 text-muted-foreground">{new Date(v.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
