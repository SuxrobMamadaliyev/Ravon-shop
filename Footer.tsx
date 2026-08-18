import { Link } from "@tanstack/react-router";
import { Phone, Send } from "lucide-react";
import { Logo } from "./Navbar";

const LINKS = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/mahsulotlar", label: "Mahsulotlar" },
  { to: "/yetkazib-berish", label: "Yetkazib berish" },
  { to: "/biz-haqimizda", label: "Biz haqimizda" },
  { to: "/faq", label: "FAQ" },
  { to: "/aloqa", label: "Aloqa" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Xitoydan to'g'ridan-to'g'ri olib kelinadigan sifatli mahsulotlar. O'zbekiston bo'ylab
            BTS Pochta orqali yetkazib berish.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Sahifalar</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Ijtimoiy tarmoqlar</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Send className="size-4 text-primary" /> Telegram: @rqvonbrend
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">◎</span> Instagram: @rqvonbrend.uz
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Aloqa</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +998 71 200 00 20
            </li>
            <li>Ish vaqti: 09:00 – 20:00</li>
            <li>Toshkent, Chilonzor</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container-page text-center text-xs text-muted-foreground">
          © 2026. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
}
