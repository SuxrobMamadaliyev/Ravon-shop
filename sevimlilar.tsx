import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/shop/ProductCard";
import { EmptyState } from "@/components/shop/States";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/sevimlilar")({
  head: () => ({
    meta: [
      { title: "Sevimlilar — RqvonBrend" },
      { name: "description", content: "Sevimli mahsulotlaringiz ro'yxati." },
      { property: "og:title", content: "Sevimlilar — RqvonBrend" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlistProducts } = useShop();

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Sevimlilar</h1>
      <p className="mt-1 text-sm text-muted-foreground">{wishlistProducts.length} ta mahsulot</p>

      {wishlistProducts.length === 0 ? (
        <div className="py-16">
          <EmptyState
            emoji="💚"
            title="Sevimlilar ro'yxati bo'sh"
            description="Yoqqan mahsulotlarni yurak belgisi orqali shu yerga qo'shing."
            actionLabel="Mahsulotlarni ko'rish"
            actionTo="/mahsulotlar"
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
