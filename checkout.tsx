import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shop/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createOrder, mockPay, quoteDelivery } from "@/data/api";
import { REGIONS } from "@/data/regions";
import { formatPhone, uzs } from "@/lib/format";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Buyurtmani rasmiylashtirish — RqvonBrend" },
      { name: "description", content: "Yetkazib berish manzili va to'lov usulini tanlab buyurtmangizni tasdiqlang." },
      { property: "og:title", content: "Buyurtmani rasmiylashtirish — RqvonBrend" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, itemsTotal, discountTotal, clearCart, setLastOrder } = useShop();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState(REGIONS[0]!.name);
  const [district, setDistrict] = useState(REGIONS[0]!.districts[0]!);
  const [street, setStreet] = useState("");
  const [comment, setComment] = useState("");
  const [method, setMethod] = useState<"payme" | "click">("payme");
  const [submitting, setSubmitting] = useState(false);

  const regionInfo = REGIONS.find((r) => r.name === region) ?? REGIONS[0]!;
  const deliveryPrice = regionInfo.baseDelivery;
  const total = Math.max(0, itemsTotal - 0) + deliveryPrice;

  if (cart.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          emoji="🛒"
          title="Savatchangiz bo'sh"
          description="Buyurtma berish uchun avval mahsulot tanlang."
          actionLabel="Mahsulotlarni ko'rish"
          actionTo="/mahsulotlar"
        />
      </div>
    );
  }

  const canSubmit = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 9 && street.trim().length > 2;

  const submit = async () => {
    if (!canSubmit) {
      toast.error("Ma'lumotlarni to'liq kiriting", {
        description: "Ism, telefon va manzil maydonlari majburiy.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await quoteDelivery({ region, district, weightKg: 1 });
      const payment = await mockPay({ method, amount: total });
      const order = await createOrder({ amount: total, method });
      setLastOrder({
        number: order.number,
        total,
        method,
        tracking: order.tracking,
      });
      toast.success("Buyurtma qabul qilindi", {
        description: `${order.number} · to'lov ${payment.transactionId}`,
      });
      clearCart();
      navigate({ to: "/" });
    } catch {
      toast.error("Xatolik yuz berdi", { description: "Qayta urinib ko'ring." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Buyurtmani rasmiylashtirish</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cart.length} ta mahsulot</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card-surface space-y-4 p-5">
            <p className="font-semibold">Aloqa ma'lumotlari</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Ism familiya</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ism familiyangiz"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefon raqam</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="+998 90 123 45 67"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="card-surface space-y-4 p-5">
            <p className="font-semibold">Yetkazib berish manzili</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Viloyat</Label>
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
              </div>
              <div className="space-y-1.5">
                <Label>Tuman</Label>
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
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="street">Ko'cha, uy</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ko'cha nomi, uy raqami"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comment">Izoh (ixtiyoriy)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Kuryerga qo'shimcha izoh"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="card-surface space-y-4 p-5">
            <p className="font-semibold">To'lov usuli</p>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as "payme" | "click")} className="grid gap-3 sm:grid-cols-2">
              <Label
                htmlFor="payme"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 has-[[data-state=checked]]:border-primary"
              >
                <RadioGroupItem value="payme" id="payme" />
                Payme
              </Label>
              <Label
                htmlFor="click"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 has-[[data-state=checked]]:border-primary"
              >
                <RadioGroupItem value="click" id="click" />
                Click
              </Label>
            </RadioGroup>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface space-y-4 p-5">
            <p className="font-semibold">Buyurtma xulosasi</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mahsulotlar</span>
                <span className="font-medium">{uzs(itemsTotal + discountTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chegirma</span>
                <span className="font-medium text-success">− {uzs(discountTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yetkazib berish</span>
                <span className="font-medium">{uzs(deliveryPrice)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-semibold">Jami</span>
                <span className="text-display text-xl">{uzs(total)}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-base"
              disabled={submitting}
              onClick={submit}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> To'lanmoqda...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Buyurtmani tasdiqlash
                </>
              )}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
