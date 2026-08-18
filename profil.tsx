import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Package, User } from "lucide-react";
import { EmptyState, LineSkeleton } from "@/components/shop/States";
import { fetchOrders } from "@/data/api";
import { uzDate, uzs } from "@/lib/format";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil — RqvonBrend" },
      { name: "description", content: "Buyurtmalar tarixi va profil ma'lumotlari." },
      { property: "og:title", content: "Profil — RqvonBrend" },
    ],
  }),
  component: ProfilePage,
});

const STATUS_LABEL: Record<string, string> = {
  created: "Yaratildi",
  paid: "To'landi",
  packing: "Yig'ilmoqda",
  handed: "Pochtaga topshirildi",
  shipping: "Yo'lda",
  delivered: "Yetkazildi",
};

function ProfilePage() {
  const orders = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });
  const list = orders.data ?? [];

  return (
    <div className="container-page py-8">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <User className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Profil</h1>
          <p className="text-sm text-muted-foreground">Buyurtmalar tarixi</p>
        </div>
      </div>

      <div className="mt-8">
        {orders.isLoading ? (
          <LineSkeleton rows={3} />
        ) : list.length === 0 ? (
          <EmptyState
            emoji="📦"
            title="Buyurtmalar yo'q"
            description="Hozircha buyurtmalaringiz mavjud emas."
            actionLabel="Xarid qilishni boshlash"
            actionTo="/mahsulotlar"
          />
        ) : (
          <div className="space-y-3">
            {list.map((o) => (
              <div key={o.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-secondary">
                    <Package className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{o.number}</p>
                    <p className="text-xs text-muted-foreground">{uzDate(o.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{uzs(o.total)}</p>
                  <p className="text-xs text-muted-foreground">{STATUS_LABEL[o.status] ?? o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
