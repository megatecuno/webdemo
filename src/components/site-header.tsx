
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart, Bell, Search, Heart, ChevronDown } from "lucide-react";
import { UserNav } from "./user-nav";
import { Input } from "./ui/input";
import { useAppContext } from "@/contexts/app-context";
import { Badge } from "./ui/badge";
import { CustomBotIcon } from "./icons/custom-bot-icon";
import { FavoritesPanel } from "./favorites-panel";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";


export function SiteHeader() {
  const { cart, favorites, isClient, user, categories } = useAppContext();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm animate-slideDown">
      <div className="container flex h-16 items-center max-w-7xl">
        {/* Left Section */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <CustomBotIcon className="h-8 w-8 text-accent" />
            <span className="font-bold">MegaTec</span>
          </Link>
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center">
            <div className="flex items-center border border-border/50 rounded-full shadow-inner bg-input/50" style={{ width: '576px', height: '33px' }}>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-full rounded-l-full rounded-r-none border-r border-border/50 px-4">
                    <span>Categorías</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {categories.map((category) => (
                    <DropdownMenuItem key={category.id} onSelect={() => router.push(`/category/${encodeURIComponent(category.name)}`)}>
                        {category.name}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                </DropdownMenu>
                <form onSubmit={handleSearch} className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                    className="w-full pl-10 h-full rounded-r-full rounded-l-none bg-transparent border-none shadow-none focus-visible:ring-0" 
                    placeholder="Buscar en todo el marketplace..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>
          {isClient && user && user.role !== 'guest' && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  {favorites.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs p-0"
                    >
                      {favorites.length}
                    </Badge>
                  )}
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Favoritos</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <FavoritesPanel />
              </SheetContent>
            </Sheet>
          )}
           <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              {isClient && totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs p-0"
                >
                  {totalItems}
                </Badge>
              )}
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito</span>
            </Button>
          </Link>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
