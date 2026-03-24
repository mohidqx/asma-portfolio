import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Monitor, Smartphone, Tablet, Globe, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type VisitorLog = Tables<"visitor_logs">;

const DeviceIcon = ({ type }: { type: string | null }) => {
  if (type === "mobile") return <Smartphone size={16} className="text-primary" />;
  if (type === "tablet") return <Tablet size={16} className="text-primary" />;
  return <Monitor size={16} className="text-primary" />;
};

const AdminVisitors = () => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [stats, setStats] = useState({ total: 0, uniqueSessions: 0, topPages: [] as { page: string; count: number }[], browsers: [] as { name: string; count: number }[] });
  const [page, setPage] = useState(0);
  const PER_PAGE = 50;

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, count } = await supabase.from("visitor_logs").select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * PER_PAGE, (page + 1) * PER_PAGE - 1);
      setLogs(data || []);

      // compute stats from all data
      const { data: all } = await supabase.from("visitor_logs").select("session_id, page_path, browser");
      if (all) {
        const sessions = new Set(all.map((v) => v.session_id).filter(Boolean));
        const pageCounts: Record<string, number> = {};
        const browserCounts: Record<string, number> = {};
        all.forEach((v) => {
          pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
          if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
        });
        setStats({
          total: count || all.length,
          uniqueSessions: sessions.size,
          topPages: Object.entries(pageCounts).map(([p, c]) => ({ page: p, count: c })).sort((a, b) => b.count - a.count).slice(0, 5),
          browsers: Object.entries(browserCounts).map(([n, c]) => ({ name: n, count: c })).sort((a, b) => b.count - a.count),
        });
      }
    };
    fetchLogs();
  }, [page]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-gradient-gold mb-8">Visitor Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <Globe className="text-primary mb-2" size={20} />
          <div className="text-2xl font-display font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Page Views</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <Clock className="text-primary mb-2" size={20} />
          <div className="text-2xl font-display font-bold text-foreground">{stats.uniqueSessions}</div>
          <div className="text-sm text-muted-foreground">Unique Sessions</div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Top Pages</div>
          {stats.topPages.map((p) => (
            <div key={p.page} className="flex justify-between text-xs mb-1">
              <span className="text-foreground truncate">{p.page}</span>
              <span className="text-primary font-semibold">{p.count}</span>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Browsers</div>
          {stats.browsers.map((b) => (
            <div key={b.name} className="flex justify-between text-xs mb-1">
              <span className="text-foreground">{b.name}</span>
              <span className="text-primary font-semibold">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Visitor Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Page</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Device</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Browser</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">OS</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Screen</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Language</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Referrer</th>
                <th className="text-left py-2 text-muted-foreground font-body font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((v) => (
                <tr key={v.id} className="border-b border-border/10">
                  <td className="py-2 text-foreground">{v.page_path}</td>
                  <td className="py-2"><DeviceIcon type={v.device_type} /></td>
                  <td className="py-2 text-muted-foreground">{v.browser}</td>
                  <td className="py-2 text-muted-foreground">{v.os}</td>
                  <td className="py-2 text-muted-foreground">{v.screen_width}×{v.screen_height}</td>
                  <td className="py-2 text-muted-foreground">{v.language}</td>
                  <td className="py-2 text-muted-foreground truncate max-w-[120px]">{v.referrer || "Direct"}</td>
                  <td className="py-2 text-muted-foreground whitespace-nowrap">{new Date(v.created_at!).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-4 py-1.5 rounded-lg bg-muted text-sm disabled:opacity-30">Previous</button>
          <button onClick={() => setPage(page + 1)} className="px-4 py-1.5 rounded-lg bg-muted text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminVisitors;
