import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductGrid } from "@/components/shop/ProductCard";
import { EmptyState, ErrorState } from "@/components/shop/States";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/data/api";
import { CATEGORIES } from "@/data/mock";
import { cn } from "@/lib/utils";

interface Search {
  kategoriya?: string | undefined;
  yangi?: boolean | undefined;
  saralash?: "popular" | "cheap" | "expensive" | "new" | undefined;
}

export const Route = createFileRoute("/mahsulotlar")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(typeof search["kategoriya"] === "string" ? { kategoriya: search["kategoriya"] } : {}),
    ...(search["yangi"] ? { yangi: tmahsulot.$slug.tsxrue } : {}),
    ...(typeof search["saralash"] === "string"
      ? { saralash: search["saralash"] as Search["saralash"] }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Mahsulotlar — RqvonBrend" },
      {
        name: "description",
        content:
          "Barcha mahsulotlar: elektronika, aksessuarlar, uy uchun, kiyim, go'zallik, gaming va sport tovarlari.",
      },
      { property: "og:title", content: "Mahsulotlar — RqvonBrend" },
      { property: "og:description", content: "Sifatli mahsulotlar katalogi va qulay narxlar." },
    ],
  }),
  component: ProductsPage,
});

const SORTS = [
  { key: "popular", label: "Mashhurligi" },
  { key: "cheap", label: "Arzonidan" },
  { key: "expensive", label: "Qimmatidan" },
  { key: "new", label: "Yangiligi" },
] as const;

const PER_PAGE = 12;

function ProductsPage() {
  const { kategoriya, yangi, saralash } = Route.useSearch();
  const navigate = useNavigate({ from: "/mahsulotlar" });
  const [page, setPage] = useState(1);
  const sort = saralash ?? "popular";

  const query = useQuery({
    queryKey: ["products", kategoriya ?? "all", yangi ?? false, sort],
    queryFn: () =>
      fetchProducts({
        ...(kategoriya ? { category: kategoriya } : {}),
        ...(yangi ? { onlyNew: true } : {}),
        sort,
      }),
  });

  const all = query.data ?? [];
  const visible = all.slice(0, page * PER_PAGE);
  const activeCategory = CATEGORIES.find((c) => c.slug === kategoriya);

  return (
    <div className="container-page py-8">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Bosh sahifa
        </Link>{" "}
        / <span className="text-foreground">Mahsulotlar</span>
      </nav>

      <h1 className="text-2xl font-bold sm:text-3xl">
        {activeCategory ? `${activeCategory.emoji} ${activeCategory.name}` : "Barcha mahsulotlar"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {query.isLoading ? "Yuklanmoqda..." : `${all.length} ta mahsulot topildi`}
      </p>

      <div className="mt-5 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => navigate({ search: (prev) => ({ ...prev, kategoriya: undefined }) })}
            className={chipClass(!kategoriya)}
          >
            Barchasi
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setPage(1);
                navigate({ search: (prev) => ({ ...prev, kategoriya: c.slug }) });
              }}
              className={chipClass(kategoriya === c.slug)}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">Saralash:</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => navigate({ search: (prev) => ({ ...prev, saralash: s.key }) })}
              className={chipClass(sort === s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : !query.isLoading && all.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Mahsulot topilmadi"
            description="Boshqa kategoriya yoki filtrni tanlab ko'ring."
          />
        ) : (
          <ProductGrid loading={query.isLoading} products={visible} skeletonCount={12} />
        )}
      </div>

      {visible.length < all.length && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="rounded-xl" onClick={() => setPage((p) => p + 1)}>
            Barchasini ko'rish ({all.length - visible.length} ta qoldi)
          </Button>
        </div>
      )}
    </div>
  );
}

function chipClass(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-muted-foreground hover:text-foreground",
  );
}
