import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useShop } from "@/store/shop";

const NAV_LINKS = [
  { to: "/kategoriyalar", label: "Kategoriyalar" },
  { to: "/mahsulotlar", label: "Mahsulotlar" },
  { to: "/chegirmalar", label: "Chegirmalar" },
  { to: "/yetkazib-berish", label: "Yetkazib berish" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-accent">
        BX
      </span>
      <span className="text-display text-lg leading-none">
        RqvonBrend
        <span className="block text-[10px] font-medium tracking-wide text-muted-foreground">
          Premium import
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-3">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menyu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <div className="mb-8">
              <Logo />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/biz-haqimizda"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
              >
                Biz haqimizda
              </Link>
              <Link
                to="/faq"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
              >
                FAQ
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            className="hidden h-10 w-56 justify-start gap-2 rounded-xl border border-border bg-surface text-muted-foreground hover:bg-secondary lg:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
            <span className="text-sm">Mahsulot qidirish...</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Qidirish"
            className="lg:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" />
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative hidden sm:inline-flex">
            <Link to="/sevimlilar" aria-label="Sevimlilar">
              <Heart className="size-5" />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 justify-center rounded-full p-0 text-[10px]">
                  {wishlist.length}
                </Badge>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Savatcha"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 size-5 justify-center rounded-full p-0 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/profil" aria-label="Profil">
              <User className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
