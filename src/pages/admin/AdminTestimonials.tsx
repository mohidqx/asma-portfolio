import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", text: "", rating: 5, published: true, sort_order: 0 });

  const fetchItems = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data || []);
  };
  useEffect(() => { fetchItems(); }, []);

  const reset = () => { setForm({ name: "", role: "", text: "", rating: 5, published: true, sort_order: 0 }); setEditing(null); setShowForm(false); };

  const edit = (item: Testimonial) => {
    setEditing(item);
    setForm({ name: item.name, role: item.role || "", text: item.text, rating: item.rating || 5, published: item.published ?? true, sort_order: item.sort_order || 0 });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.text) { toast.error("Name and text required"); return; }
    if (editing) {
      const { error } = await supabase.from("testimonials").update(form).eq("id", editing.id);
      if (error) toast.error(error.message); else { toast.success("Updated"); reset(); fetchItems(); }
    } else {
      const { error } = await supabase.from("testimonials").insert(form);
      if (error) toast.error(error.message); else { toast.success("Created"); reset(); fetchItems(); }
    }
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("testimonials").delete().eq("id", id); toast.success("Deleted"); fetchItems(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gradient-gold">Testimonials</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm"><Plus size={18} /> Add</button>
      </div>
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm font-body focus:outline-none focus:border-primary/50" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role / Company" className="px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm font-body focus:outline-none focus:border-primary/50" />
          </div>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Testimonial text" rows={4} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm font-body resize-none focus:outline-none focus:border-primary/50" />
          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm">Save</button>
            <button onClick={reset} className="px-6 py-2 rounded-xl bg-muted text-foreground font-body text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-5 flex items-center justify-between">
            <div><h3 className="font-display font-semibold text-foreground">{item.name}</h3><p className="text-xs text-muted-foreground mt-1">{item.role} • ★{item.rating}</p></div>
            <div className="flex gap-2">
              <button onClick={() => edit(item)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"><Pencil size={16} /></button>
              <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No testimonials yet.</p>}
      </div>
    </div>
  );
};

export default AdminTestimonials;
