import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shop/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findPromo } from "@/data/api";
import type { PromoCode } from "@/data/types";
import { uzs } from "@/lib/format";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/savatcha")({
  head: () => ({
    meta: [
      { title: "Savatcha — RqvonBrend" },
      { name: "description", content: "Savatchangizdagi mahsulotlar, promokod va buyurtma xulosasi." },
      { property: "og:title", content: "Savatcha — RqvonBrend" },
      { property: "og:description", content: "Buyurtmani rasmiylashtirishdan oldin ko'rib chiqing." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, itemsTotal, discountTotal, setQuantity, removeFromCart } = useShop();
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState<PromoCode | null>(null);

  const promoDiscount = promo
    ? promo.type === "amount"
      ? promo.value
      : Math.round((itemsTotal * promo.value) / 100)
    : 0;

  const apply = () => {
    const found = findPromo(code);
    if (!found) {
      toast.error("Promokod topilmadi", { description: "Kodni tekshirib qayta kiriting." });
      return;
    }
    if (itemsTotal < found.minTotal) {
      toast.error("Promokod qo'llanmadi", {
        description: `Minimal summa: ${uzs(found.minTotal)}`,
      });
      return;
    }
    setPromo(found);
    toast.success(`${found.code} qo'llandi`, { description: found.label });
  };

  if (cart.length === 0) {
    return (
      <div className="container-page py-16">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Savatcha</h1>
        <EmptyState
          emoji="🛒"
          title="Savatchangiz bo'sh"
          description="Mahsulotlarni ko'rib chiqing va savatchaga qo'shing."
          actionLabel="Mahsulotlarni ko'rish"
          actionTo="/mahsulotlar"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Savatcha</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cart.length} ta mahsulot</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="card-surface flex gap-4 p-4">
              <Link to="/mahsulot/$slug" params={{ slug: product.slug }} className="shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  width={200}
                  height={200}
                  className="size-24 rounded-xl bg-surface object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to="/mahsulot/$slug"
                  params={{ slug: product.slug }}
                  className="line-clamp-2 font-semibold hover:text-primary"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {uzs(product.price)} / dona
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-xl border border-border">
                    <button
                      type="button"
                      aria-label="Kamaytirish"
                      className="grid size-9 place-items-center rounded-l-xl hover:bg-secondary"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Ko'paytirish"
                      className="grid size-9 place-items-center rounded-r-xl hover:bg-secondary"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{uzs(product.price * quantity)}</span>
                    <button
                      type="button"
                      aria-label="O'chirish"
                      className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface space-y-4 p-5">
            <p className="font-semibold">Buyurtma xulosasi</p>
            <div className="space-y-2 text-sm">
              <Row label="Mahsulotlar" value={uzs(itemsTotal + discountTotal)} />
              <Row label="Chegirma" value={`− ${uzs(discountTotal)}`} accent />
              {promo && <Row label={`Promokod (${promo.code})`} value={`− ${uzs(promoDiscount)}`} accent />}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yetkazib berish</span>
                <span className="text-xs text-muted-foreground">BTS orqali hisoblanadi</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-semibold">Jami</span>
                <span className="text-display text-xl">
                  {uzs(Math.max(0, itemsTotal - promoDiscount))}
                </span>
              </div>
            </div>
            <Button asChild size="lg" className="h-12 w-full rounded-xl text-base">
              <Link to="/checkout">Buyurtma berish</Link>
            </Button>
          </div>

          <div className="card-surface space-y-3 p-5">
            <p className="text-sm font-semibold">PROMO KOD</p>
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Promokod kiriting"
                className="rounded-xl"
              />
              <Button variant="secondary" className="rounded-xl" onClick={apply}>
                Qo'llash
              </Button>
            </div>
            {promo && (
              <p className="text-sm font-medium text-success">
                ✓ {promo.code} qo'llandi — {promo.label}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Sinov uchun: PROMO2026, YANGI10</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-success" : "font-medium"}>{value}</span>
    </div>
  );
}
