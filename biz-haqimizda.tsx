import { createFileRoute } from "@tanstack/react-router";
import { Award, Headphones, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/biz-haqimizda")({
  head: () => ({
    meta: [
      { title: "Biz haqimizda — RqvonBrend" },
      {
        name: "description",
        content: "RqvonBrend — O'zbekiston bo'ylab sifatli mahsulotlarni yetkazib beruvchi onlayn do'kon.",
      },
      { property: "og:title", content: "Biz haqimizda — RqvonBrend" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Sifat kafolati", text: "Har bir mahsulot sotuvga chiqarishdan oldin tekshiriladi." },
  { icon: Truck, title: "Tez yetkazib berish", text: "BTS Pochta orqali O'zbekiston bo'ylab 1–7 ish kunida." },
  { icon: Headphones, title: "Qo'llab-quvvatlash", text: "Savollaringizga har kuni javob beramiz." },
  { icon: Award, title: "Ishonchli tajriba", text: "Minglab mijozlar bizni tanladi va qayta xarid qilmoqda." },
];

function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Biz haqimizda</h1>
        <p className="mt-4 text-muted-foreground">
          RqvonBrend — foydalanuvchilarga qulay, tez va ishonchli onlayn xarid qilish tajribasini
          taqdim etuvchi elektron tijorat platformasi. Biz mahsulotlarni ehtiyotkorlik bilan tanlaymiz,
          narxlarni raqobatbardosh saqlaymiz va O'zbekistonning istalgan burchagiga BTS Pochta orqali
          yetkazib beramiz.
        </p>
        <p className="mt-3 text-muted-foreground">
          Maqsadimiz — har bir buyurtmani sifatli, tez va bexatar yetkazish, shu bilan birga mijozlarimiz
          bilan uzoq muddatli ishonchli munosabatlar o'rnatish.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => (
          <div key={v.title} className="card-surface space-y-3 p-5">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <v.icon className="size-5" />
            </div>
            <p className="font-semibold">{v.title}</p>
            <p className="text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
