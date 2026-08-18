import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Countdown } from "@/components/shop/Countdown";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ErrorState } from "@/components/shop/States";
import { fetchProducts } from "@/data/api";

export const Route = createFileRoute("/chegirmalar")({
  head: () => ({
    meta: [
      { title: "Chegirmalar — RqvonBrend" },
      {
        name: "description",
        content: "Chegirmadagi mahsulotlar: 20% dan 30% gacha tejash imkoniyati. Cheklangan muddat.",
      },
      { property: "og:title", content: "Chegirmalar — RqvonBrend" },
      { property: "og:description", content: "Eng yaxshi chegirmalar va cheklangan aksiyalar." },
    ],
  }),
  component: DiscountsPage,
});

function DiscountsPage() {
  const query = useQuery({
    queryKey: ["products", "discount"],
    queryFn: () => fetchProducts({ onlyDiscount: true, sort: "popular" }),
  });

  return (
    <div>
      <section className="gradient-ink py-10 text-ink-foreground">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">⚡ Chegirmalar tugashiga oz qoldi</h1>
            <p className="mt-1 text-sm text-ink-foreground/70">
              Aksiya cheklangan miqdordagi mahsulotlar uchun amal qiladi.
            </p>
          </div>
          <Countdown />
        </div>
      </section>

      <div className="container-page py-10">
        {query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : (
          <ProductGrid loading={query.isLoading} products={query.data} skeletonCount={12} />
        )}
      </div>
    </div>
  );
}
