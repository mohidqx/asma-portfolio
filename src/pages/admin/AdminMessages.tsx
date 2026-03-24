import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"contact_messages">;

const AdminMessages = () => {
  const [items, setItems] = useState<Message[]>([]);

  const fetchItems = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetchItems(); }, []);

  const toggleRead = async (item: Message) => {
    await supabase.from("contact_messages").update({ read: !item.read }).eq("id", item.id);
    fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-gradient-gold mb-8">Contact Messages</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`glass-card rounded-xl p-5 ${!item.read ? "border-primary/30" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.email}</span>
                  {!item.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{item.message}</p>
                <p className="text-xs text-muted-foreground/50 mt-2">{new Date(item.created_at!).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 ml-4">
                <button onClick={() => toggleRead(item)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground">
                  {item.read ? <Mail size={16} /> : <MailOpen size={16} />}
                </button>
                <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminMessages;
