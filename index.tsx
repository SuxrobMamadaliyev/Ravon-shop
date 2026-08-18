import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ShieldCheck, Truck, Zap } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Countdown } from "@/components/shop/Countdown";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ErrorState, Section } from "@/components/shop/States";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/data/api";
import { CATEGORIES, FAQ_ITEMS } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RqvonBrend — Xitoydan sifatli mahsulotlar, O'zbekiston bo'ylab yetkazish" },
      {
        name: "description",
        content:
          "Premium onlayn do'kon: elektronika, aksessuarlar, uy uchun mahsulotlar. BTS Pochta orqali yetkazib berish, Payme va Click orqali xavfsiz to'lov.",
      },
      { property: "og:title", content: "RqvonBrend — premium onlayn do'kon" },
      {
        property: "og:description",
        content: "Sifatli mahsulotlar, qulay narxlar va O'zbekiston bo'ylab yetkazib berish.",
      },
    ],
  }),
  component: HomePage,
});

const TRUST = [
  { icon: Truck, title: "O'zbekiston bo'ylab", text: "BTS Pochta orqali yetkazish" },
  { icon: ShieldCheck, title: "Xavfsiz to'lov", text: "Payme va Click orqali" },
  { icon: Zap, title: "Tezkor xizmat", text: "Buyurtma 24 soatda yig'iladi" },
  { icon: BadgeCheck, title: "Sifat kafolati", text: "Har bir mahsulot tekshiriladi" },
];

const WHY = [
  { title: "Sifatli mahsulot", text: "Mahsulotlar tekshirilgan holda sotiladi." },
  { title: "Qulay narx", text: "To'g'ridan-to'g'ri yetkazib berish orqali qulay narxlar." },
  { title: "O'zbekiston bo'ylab", text: "BTS Pochta orqali barcha viloyatlarga yetkazamiz." },
  { title: "Xavfsiz to'lov", text: "Payme va Click — ishonchli to'lov tizimlari." },
];

function HomePage() {
  const popular = useQuery({ queryKey: ["products", "popular"], queryFn: () => fetchProducts({ sort: "popular" }) });
  const flash = useQuery({ queryKey: ["products", "flash"], queryFn: () => fetchProducts({ onlyDiscount: true, sort: "cheap" }) });
  const fresh = useQuery({ queryKey: ["products", "new"], queryFn: () => fetchProducts({ onlyNew: true }) });

  return (
    <div>
      {/* HERO */}
      <section className="gradient-warm border-b border-border">
        <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
          <div className="animate-rise space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              🇺🇿 O'zbekiston bo'ylab yetkazib berish
            </span>
            <h1 className="text-3xl leading-[1.1] font-extrabold sm:text-5xl lg:text-6xl">
              Siz izlagan mahsulotlar — endi yanada qulay.
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Sifatli mahsulotlar, qulay narxlar va O'zbekiston bo'ylab yetkazib berish.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base">
                <Link to="/mahsulotlar">Mahsulotlarni ko'rish</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6 text-base">
                <Link to="/chegirmalar">Chegirmalarni ko'rish</Link>
              </Button>
            </div>
          </div>

          <div className="animate-pop relative">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
              <img
                src={heroImage}
                alt="Premium mahsulotlar to'plami"
                width={1400}
                height={1100}
                className="aspect-[7/5] w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="container-page grid grid-cols-2 gap-3 pb-10 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="card-surface flex items-start gap-3 p-4">
              <t.icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container-page space-y-16 py-14">
        {/* KATEGORIYALAR */}
        <Section
          title="Kategoriyalar"
          subtitle="Kerakli bo'limni tanlang"
          action={
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/kategoriyalar">
                Barchasi <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        >
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/mahsulotlar"
                search={{ kategoriya: c.slug }}
                className="card-surface hover-lift min-w-40 snap-start p-4"
              >
                <span className="text-2xl">{c.emoji}</span>
                <p className="mt-3 font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </Section>

        {/* MASHHUR MAHSULOTLAR */}
        <Section
          title="🔥 Mashhur mahsulotlar"
          subtitle="Eng ko'p sotilgan mahsulotlar"
          action={
            <Button asChild variant="ghost" className="hidden rounded-xl sm:inline-flex">
              <Link to="/mahsulotlar">
                Barchasini ko'rish <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        >
          {popular.isError ? (
            <ErrorState onRetry={() => popular.refetch()} />
          ) : (
            <ProductGrid loading={popular.isLoading} products={popular.data?.slice(0, 8)} />
          )}
        </Section>
      </div>

      {/* FLASH SALE */}
      <section className="gradient-ink py-14 text-ink-foreground">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">⚡ Chegirmalar tugashiga oz qoldi</h2>
              <p className="mt-1 text-sm text-ink-foreground/70">
                Cheklangan miqdorda — shoshiling!
              </p>
            </div>
            <Countdown />
          </div>
          {flash.isError ? (
            <ErrorState onRetry={() => flash.refetch()} />
          ) : (
            <ProductGrid loading={flash.isLoading} products={flash.data?.slice(0, 4)} skeletonCount={4} />
          )}
          <div className="mt-6 text-center">
            <Button asChild variant="secondary" size="lg" className="rounded-xl">
              <Link to="/chegirmalar">Barcha chegirmalar</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-14">
        {/* YANGI MAHSULOTLAR */}
        <Section
          title="✨ Yangi mahsulotlar"
          subtitle="Omborga yangi kelgan mahsulotlar"
          action={
            <Button asChild variant="ghost" className="hidden rounded-xl sm:inline-flex">
              <Link to="/mahsulotlar" search={{ yangi: true }}>
                Barchasini ko'rish <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        >
          {fresh.isError ? (
            <ErrorState onRetry={() => fresh.refetch()} />
          ) : (
            <ProductGrid loading={fresh.isLoading} products={fresh.data?.slice(0, 8)} />
          )}
        </Section>

        {/* NEGA BIZ */}
        <Section title="Nega biz?" subtitle="Mijozlar bizni tanlashining sabablari">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="card-surface hover-lift p-5">
                <p className="font-semibold">{w.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        <Section title="Ko'p so'raladigan savollar" subtitle="Qisqa javoblar">
          <Accordion type="single" collapsible className="card-surface divide-y divide-border px-4">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-0">
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </div>
    </div>
  );
}
