import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { REGIONS } from "@/data/regions";
import { uzs } from "@/lib/format";

export const Route = createFileRoute("/yetkazib-berish")({
  head: () => ({
    meta: [
      { title: "Yetkazib berish — RqvonBrend" },
      {
        name: "description",
        content: "BTS Pochta orqali O'zbekiston bo'ylab yetkazib berish narxlari va muddatlari.",
      },
      { property: "og:title", content: "Yetkazib berish — RqvonBrend" },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <div className="container-page py-12">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Truck className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Yetkazib berish</h1>
          <p className="text-sm text-muted-foreground">BTS Pochta orqali O'zbekiston bo'ylab</p>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-muted-foreground">
        Buyurtma to'lov tasdiqlangach 24 soat ichida yig'iladi va BTS Pochtaga topshiriladi. Yetkazib
        berish narxi manzil va mahsulot og'irligi asosida hisoblanadi.
      </p>

      <div className="card-surface mt-8 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Viloyat</th>
              <th className="px-5 py-3 font-medium">Boshlang'ich narx</th>
              <th className="px-5 py-3 font-medium">Muddat</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((r) => (
              <tr key={r.name} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{r.name}</td>
                <td className="px-5 py-3">{uzs(r.baseDelivery)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {r.days[0]}–{r.days[1]} ish kuni
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
