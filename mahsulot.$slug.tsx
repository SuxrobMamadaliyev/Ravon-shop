import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  Heart,
  Maximize2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { EmptyState, LineSkeleton, Section } from "@/components/shop/States";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProduct, fetchReviews, quoteDelivery } from "@/data/api";
import { PRODUCTS } from "@/data/mock";
import { REGIONS } from "@/data/regions";
import { discountPercent, uzDate, uzs } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/mahsulot/$slug")({
  head: () => ({
    meta: [
      { title: "Mahsulot — RqvonBrend" },
      {
        name: "description",
        content:
          "Mahsulot tafsilotlari, narxi, sharhlar va BTS Pochta orqali yetkazib berish shartlari.",
      },
      { property: "og:title", content: "Mahsulot — RqvonBrend" },
      { property: "og:description", content: "Mahsulot tafsilotlari va yetkazib berish shartlari." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWished, setCartOpen } = useShop();

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [qty, setQty] = useState(1);
  const [region, setRegion] = useState(REGIONS[2]!.name);
  const [district, setDistrict] = useState<string>(REGIONS[2]!.districts[0]!);

  const product = useQuery({ queryKey: ["product", slug], queryFn: () => fetchProduct(slug) });
  const p = product.data;
  const reviews = useQuery({
    queryKey: ["reviews", p?.id],
    queryFn: () => fetchReviews(p!.id),
    enabled: !!p,
  });
  const delivery = useQuery({
    queryKey: ["delivery", region, district, p?.weightKg],
    queryFn: () => quoteDelivery({ region, district, weightKg: p?.weightKg ?? 1 }),
    enabled: !!p,
  });

  if (product.isLoading) {
    return (
      <div className="container-page grid gap-8 py-8 lg:grid-cols-2">
        <div className="aspect-square w-full animate-pulse rounded-3xl bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="container-page py-16">
        <EmptyState
          emoji="🔍"
          title="Mahsulot topilmadi"
          description="Bu mahsulot mavjud emas yoki sotuvdan olingan."
          actionLabel="Mahsulotlarni ko'rish"
          actionTo="/mahsulotlar"
        />
      </div>
    );
  }

  const off = discountPercent(p.price, p.oldPrice);
  const wished = isWished(p.id);
  const list = reviews.data ?? [];
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : p.rating;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => r.rating === star).length,
  }));
  const similar = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const regionInfo = REGIONS.find((r) => r.name === region) ?? REGIONS[0]!;

  const buyNow = () => {
    addToCart(p, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="container-page py-8">
      <nav className="mb-5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Bosh sahifa
        </Link>{" "}
        /{" "}
        <Link to="/mahsulotlar" search={{ kategoriya: p.category }} className="hover:text-primary">
          {p.category}
        </Link>{" "}
        / <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* GALEREYA */}
        <div className="space-y-3">
          <div className="group card-surface relative overflow-hidden">
            <img
              src={p.images[active]}
              alt={p.name}
              width={900}
              height={900}
              className="aspect-square w-full bg-surface object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <button
              type="button"
              aria-label="To'liq ekran"
              onClick={() => setZoom(true)}
              className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full border border-border bg-card/90 backdrop-blur transition-transform hover:scale-105"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
          <div className="flex gap-2">
            {p.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "overflow-hidden rounded-xl border-2 transition-colors",
                  active === i ? "border-primary" : "border-border",
                )}
              >
                <img
                  src={img}
                  alt={`${p.name} ${i + 1}`}
                  loading="lazy"
                  width={200}
                  height={200}
                  className="size-20 bg-surface object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="space-y-5">
          <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-chart-4 text-chart-4" />
              <span className="font-semibold">{p.rating}</span>
            </span>
            <span className="text-muted-foreground">{p.soldCount} ta sotilgan</span>
            <span className="text-muted-foreground">{p.reviewCount} ta sharh</span>
          </div>

          <div className="card-surface space-y-2 p-5">
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-display text-3xl">{uzs(p.price)}</span>
              {p.oldPrice && (
                <span className="text-base text-muted-foreground line-through">
                  {uzs(p.oldPrice)}
                </span>
              )}
              {off !== null && (
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                  -{off}%
                </span>
              )}
            </div>
            {p.stock > 0 ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                <Check className="size-4" /> Omborda mavjud
                {p.stock <= 5 && (
                  <span className="ml-1 text-destructive">
                    · ⚠️ Faqat {p.stock} dona qoldi
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm font-medium text-destructive">Mahsulot tugagan</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-border">
              <button
                type="button"
                aria-label="Kamaytirish"
                className="grid size-11 place-items-center rounded-l-xl hover:bg-secondary"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Ko'paytirish"
                className="grid size-11 place-items-center rounded-r-xl hover:bg-secondary"
                onClick={() => setQty((q) => Math.min(Math.max(p.stock, 1), q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">Jami: {uzs(p.price * qty)}</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              size="lg"
              className="h-12 rounded-xl text-base"
              disabled={p.stock === 0}
              onClick={() => {
                addToCart(p, qty);
                setCartOpen(true);
              }}
            >
              <ShoppingCart className="size-5" /> Savatchaga qo'shish
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 rounded-xl text-base"
              disabled={p.stock === 0}
              onClick={buyNow}
            >
              <Zap className="size-5" /> Hozir sotib olish
            </Button>
          </div>

          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={() => toggleWishlist(p)}
          >
            <Heart className={cn("size-4", wished && "fill-primary text-primary")} />
            {wished ? "Sevimlilarda" : "Sevimlilarga"}
          </Button>

          {/* YETKAZIB BERISH */}
          <div className="card-surface space-y-4 p-5">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-primary" />
              <p className="font-semibold">Yetkazib berish</p>
            </div>
            <p className="text-sm text-muted-foreground">
              BTS Pochta orqali O'zbekiston bo'ylab. Narx manzil va og'irlik asosida hisoblanadi.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Select
                value={region}
                onValueChange={(v) => {
                  setRegion(v);
                  const r = REGIONS.find((x) => x.name === v);
                  setDistrict(r?.districts[0] ?? "");
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Viloyat" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r.name} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Tuman" />
                </SelectTrigger>
                <SelectContent>
                  {regionInfo.districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl bg-surface p-4 text-sm">
              <p className="font-medium">
                {region} → Toshkent (ombor)
              </p>
              {delivery.isLoading ? (
                <div className="mt-2 h-5 w-32 animate-pulse rounded bg-muted" />
              ) : (
                <>
                  <p className="mt-1">
                    Yetkazib berish:{" "}
                    <span className="font-bold text-primary">
                      {uzs(delivery.data?.price ?? regionInfo.baseDelivery)}
                    </span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Muddat: {delivery.data?.minDays ?? regionInfo.days[0]}–
                    {delivery.data?.maxDays ?? regionInfo.days[1]} ish kuni
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLAR */}
      <Tabs defaultValue="tavsif" className="mt-12">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-secondary p-1">
          <TabsTrigger value="tavsif" className="rounded-lg">
            Tavsif
          </TabsTrigger>
          <TabsTrigger value="xususiyatlar" className="rounded-lg">
            Xususiyatlar
          </TabsTrigger>
          <TabsTrigger value="yetkazish" className="rounded-lg">
            Yetkazib berish
          </TabsTrigger>
          <TabsTrigger value="sharhlar" className="rounded-lg">
            Sharhlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tavsif" className="card-surface mt-4 p-6 text-sm leading-relaxed">
          <p>{p.description}</p>
          <p className="mt-3 text-muted-foreground">{p.shortDescription}</p>
        </TabsContent>

        <TabsContent value="xususiyatlar" className="card-surface mt-4 p-6">
          <dl className="divide-y divide-border text-sm">
            {p.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-3">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>

        <TabsContent value="yetkazish" className="card-surface mt-4 space-y-3 p-6 text-sm">
          <p className="font-semibold">🚚 BTS Pochta orqali yetkazib berish</p>
          <p className="text-muted-foreground">
            Buyurtma to'lov tasdiqlangach 24 soat ichida yig'iladi va BTS Pochtaga topshiriladi.
            Yetkazib berish narxi manzil va mahsulot og'irligi asosida hisoblanadi.
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Toshkent shahri: 1–2 ish kuni</li>
            <li>Viloyatlar: 2–5 ish kuni</li>
            <li>Qoraqalpog'iston: 4–7 ish kuni</li>
          </ul>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/yetkazib-berish">Yetkazish muddatini ko'rish</Link>
          </Button>
        </TabsContent>

        <TabsContent value="sharhlar" className="mt-4 space-y-4">
          <div className="card-surface grid gap-6 p-6 sm:grid-cols-[200px_1fr]">
            <div className="text-center sm:text-left">
              <p className="text-display text-4xl">{avg.toFixed(1)}</p>
              <p className="mt-1 text-sm text-chart-4">{"⭐".repeat(Math.round(avg))}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.reviewCount} ta sharh · {avg.toFixed(1)} / 5
              </p>
            </div>
            <div className="space-y-2">
              {breakdown.map((b) => (
                <div key={b.star} className="flex items-center gap-3 text-xs">
                  <span className="w-8 text-muted-foreground">{b.star} ⭐</span>
                  <Progress
                    value={list.length ? (b.count / list.length) * 100 : 0}
                    className="h-2 flex-1"
                  />
                  <span className="w-6 text-right text-muted-foreground">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {reviews.isLoading ? (
            <LineSkeleton rows={3} />
          ) : (
            <div className="space-y-3">
              {list.map((r) => (
                <div key={r.id} className="card-surface flex gap-4 p-5">
                  <Avatar>
                    <AvatarFallback>{r.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{r.author}</p>
                      <span className="text-xs text-chart-4">{"⭐".repeat(r.rating)}</span>
                      <span className="text-xs text-muted-foreground">{uzDate(r.date)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                    {r.photo && (
                      <img
                        src={r.photo}
                        alt="Sharh rasmi"
                        loading="lazy"
                        width={200}
                        height={200}
                        className="mt-3 size-20 rounded-xl bg-surface object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* O'XSHASH */}
      <Section title="O'xshash mahsulotlar" className="mt-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {similar.map((s) => (
            <ProductCard key={s.id} product={s} />
          ))}
        </div>
      </Section>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-3xl overflow-hidden rounded-3xl p-0">
          <img
            src={p.images[active]}
            alt={p.name}
            width={900}
            height={900}
            className="w-full bg-surface object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
