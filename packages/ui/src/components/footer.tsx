import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";
import { Github } from "lucide-react";

import { Logo } from "./logo";

export function Footer({ product }: { product: Product }) {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            A family of open-source coding agents by {AUTHOR.name}. Resume projects, built in public, not a
            startup pitch.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Products</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            {PRODUCT_LIST.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="hover:text-white">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>
              <a href={PERSONAL_LINKS.website} target="_blank" rel="noreferrer" className="hover:text-white">
                {AUTHOR.websiteLabel}
              </a>
            </li>
            <li>
              <a href={PERSONAL_LINKS.blog} target="_blank" rel="noreferrer" className="hover:text-white">
                Blog
              </a>
            </li>
            <li>
              <a href={product.motherRepo} target="_blank" rel="noreferrer" className="hover:text-white">
                Mother repo
              </a>
            </li>
            <li>
              <a href={product.github} target="_blank" rel="noreferrer" className="hover:text-white">
                {product.shortName} repo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-white/5 px-5 py-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} {AUTHOR.name}. MIT-licensed experiments.</p>
        <a
          href={PERSONAL_LINKS.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-white"
        >
          <Github className="size-3.5" />
          github.com/iresharma
        </a>
      </div>
    </footer>
  );
}
