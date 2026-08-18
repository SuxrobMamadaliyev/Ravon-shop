import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Ko'p beriladigan savollar — RqvonBrend" },
      { name: "description", content: "RqvonBrend bo'yicha eng ko'p beriladigan savollarga javoblar." },
      { property: "og:title", content: "FAQ — RqvonBrend" },
    ],
  }),
  component: FaqPage,
});

const QA = [
  {
    q: "Buyurtmani qanday berish mumkin?",
    a: "Mahsulotni tanlab savatchaga qo'shing, so'ngra 'Buyurtma berish' tugmasini bosib manzil va to'lov usulini kiritib buyurtmani tasdiqlang.",
  },
  {
    q: "Yetkazib berish qancha vaqt oladi?",
    a: "Toshkent shahri bo'yicha 1–2 ish kuni, viloyatlar bo'yicha 2–7 ish kuni ichida BTS Pochta orqali yetkazib beriladi.",
  },
  {
    q: "Qanday to'lov usullari mavjud?",
    a: "Payme va Click orqali onlayn to'lov qilishingiz mumkin.",
  },
  {
    q: "Mahsulotni qaytarish mumkinmi?",
    a: "Ha, mahsulot nuqsonli yoki tavsifga mos kelmasa, yetkazib berilgandan so'ng 7 kun ichida qaytarish mumkin.",
  },
  {
    q: "Buyurtma holatini qanday kuzataman?",
    a: "Profil bo'limidagi buyurtmalar ro'yxati orqali va tracking raqami yordamida BTS Pochta saytida kuzatishingiz mumkin.",
  },
];

function FaqPage() {
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Ko'p beriladigan savollar</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Xarid qilish, to'lov va yetkazib berish haqidagi eng ko'p beriladigan savollarga javoblar.
      </p>

      <div className="card-surface mt-8 p-2 sm:p-4">
        <Accordion type="single" collapsible>
          {QA.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="px-2 text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="px-2 text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
