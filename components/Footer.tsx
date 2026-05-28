import Link from "next/link";
import { ChefHat, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-7 w-7 text-orange-500" />
              <span className="text-lg font-bold text-white">
                Kok<span className="text-orange-500">Kitchens</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              Authentic Nigerian cuisine made with love. From our kitchen to
              your table — feeding individuals and events across the city.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="hover:text-orange-400 transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/catering" className="hover:text-orange-400 transition-colors">
                  Catering Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                +234 801 234 5678
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                hello@kokkitchens.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                Lagos, Nigeria
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hours
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Mon – Fri: 10am – 9pm</li>
              <li>Sat – Sun: 11am – 10pm</li>
              <li className="pt-2">
                <span className="text-orange-400 font-medium">
                  Catering: Available 7 days
                </span>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-stone-800 hover:bg-orange-600 transition-colors text-xs font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} KokKitchens. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
