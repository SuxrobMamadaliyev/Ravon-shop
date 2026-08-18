import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/aloqa")({
  head: () => ({
    meta: [
      { title: "Aloqa — RqvonBrend" },
      { name: "description", content: "RqvonBrend jamoasi bilan bog'laning: telefon, telegram va manzil." },
      { property: "og:title", content: "Aloqa — RqvonBrend" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Ma'lumotlarni to'ldiring", { description: "Ism va xabar maydonlari majburiy." });
      return;
    }
    toast.success("Xabaringiz yuborildi", { description: "Tez orada siz bilan bog'lanamiz." });
    setName("");
    setMessage("");
  };

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Aloqa</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Savollaringiz bormi? Quyidagi ma'lumotlar orqali yoki forma yordamida biz bilan bog'laning.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card-surface space-y-4 p-5">
          <p className="font-semibold">Xabar yuborish</p>
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Ism</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-message">Xabar</Label>
            <Textarea
              id="c-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl"
              rows={5}
            />
          </div>
          <Button className="rounded-xl" onClick={send}>
            Yuborish
          </Button>
        </div>

        <aside className="space-y-4">
          <div className="card-surface space-y-3 p-5 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +998 71 200 00 20
            </p>
            <p className="flex items-center gap-2">
              <Send className="size-4 text-primary" /> Telegram: @rqvonbrend
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> info@rqvonbrend.uz
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Ish vaqti: 09:00 – 20:00
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Toshkent, Chilonzor
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
