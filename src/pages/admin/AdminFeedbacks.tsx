import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Feedback = Tables<"feedbacks">;

const AdminFeedbacks = () => {
  const [items, setItems] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchItems = async () => {
    let q = supabase.from("feedbacks").select("*").order("created_at", { ascending: false });
    if (filter === "pending") q = q.eq("approved", false);
    if (filter === "approved") q = q.eq("approved", true);
    const { data } = await q;
    setItems(data || []);
  };
  useEffect(() => { fetchItems(); }, [filter]);

  const approve = async (id: string) => {
    await supabase.from("feedbacks").update({ approved: true }).eq("id", id);
    toast.success("Approved");
    fetchItems();
  };

  const reject = async (id: string) => {
    await supabase.from("feedbacks").update({ approved: false }).eq("id", id);
    fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("feedbacks").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gradient-gold">Feedbacks</h1>
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-body ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-foreground">{item.name}</span>
                  {item.email && <span className="text-xs text-muted-foreground">({item.email})</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.approved ? "bg-accent/20 text-accent-foreground" : "bg-destructive/10 text-destructive"}`}>
                    {item.approved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="text-primary fill-primary" size={14} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{item.message}</p>
                <p className="text-xs text-muted-foreground/50 mt-2">{new Date(item.created_at!).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 ml-4">
                {!item.approved && <button onClick={() => approve(item.id)} className="p-2 rounded-lg hover:bg-accent/20 text-accent-foreground"><Check size={16} /></button>}
                {item.approved && <button onClick={() => reject(item.id)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"><X size={16} /></button>}
                <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No feedbacks yet.</p>}
      </div>
    </div>
  );
};

export default AdminFeedbacks;
