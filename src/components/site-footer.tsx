
"use client"

import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";
import { CustomBotIcon } from "./icons/custom-bot-icon";
import { useAppContext } from "@/contexts/app-context";

export function SiteFooter() {
  const { categories } = useAppContext();
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
             <Link href="/" className="flex items-center space-x-2">
              <CustomBotIcon className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">MegaTec</span>
            </Link>
            <p className="text-sm text-muted-foreground">El marketplace del futuro, hoy.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><Instagram /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><Facebook /></Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${encodeURIComponent(cat.name)}`} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Contacto</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>

          <div>
             <h3 className="font-semibold mb-4">Contacto</h3>
             <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>Av. Siempreviva 742</p>
                <p>Springfield, USA</p>
                <p>Email: <a href="mailto:contacto@megatec.com" className="hover:text-accent transition-colors">contacto@megatec.com</a></p>
                <p>Tel: <a href="tel:+1234567890" className="hover:text-accent transition-colors">+1 (234) 567-890</a></p>
             </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MegaTec Marketplace. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

    