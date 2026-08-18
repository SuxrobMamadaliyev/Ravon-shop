import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS } from "@/data/mock";

export const Route = createFileRoute("/kategoriyalar")({
  head: () => ({
    meta: [
      { title: "Kategoriyalar — RqvonBrend" },
      {
        name: "description",
        content:
          "8 ta kategoriya: elektronika, aksessuarlar, uy uchun, kiyim, go'zallik, gaming, sovg'alar va sport.",
      },
      { property: "og:title", content: "Kategoriyalar — RqvonBrend" },
      { property: "og:description", content: "Kerakli bo'limni tanlab mahsulotlarni ko'ring." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Kategoriyalar</h1>
      <p className="mt-1 text-sm text-muted-foreground">Bo'limlar bo'yicha mahsulotlarni ko'ring</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const items = PRODUCTS.filter((p) => p.category === c.slug);
          const cover = items[0]?.images[0];
          return (
            <Link
              key={c.slug}
              to="/mahsulotlar"
              search={{ kategoriya: c.slug }}
              className="card-surface hover-lift group overflow-hidden"
            >
              {cover && (
                <img
                  src={cover}
                  alt={c.name}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="aspect-[4/3] w-full bg-surface object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="p-4">
                <p className="text-lg">{c.emoji}</p>
                <p className="mt-1 font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                <p className="mt-3 text-xs font-medium text-primary">{items.length} ta mahsulot</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
