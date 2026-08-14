# CodeLoom pages

Coming-soon landing pages for the CodeLoom family — an educational / resume project by [Iresh Sharma](https://iresharma.com).

This is a single Next.js app today. Shared product copy and UI live in packages so each site can be split out later without rewriting the pages.

| Product | Route (now) | Intended host |
| --- | --- | --- |
| CodeLoom agent | `/` | [codeloom.iresharma.com](https://codeloom.iresharma.com) |
| CodeLoom IDE | `/ide` | [ide.codeloom.iresharma.com](https://ide.codeloom.iresharma.com) |
| CodeLoom TUI | `/tui` | [tui.codeloom.iresharma.com](https://tui.codeloom.iresharma.com) |
| CodeLoom CLI | `/cli` | [cli.codeloom.iresharma.com](https://cli.codeloom.iresharma.com) |

## Stack

- pnpm workspaces + Turborepo
- Next.js 15 (App Router) in `apps/web`
- Shared UI in `packages/ui`
- Product metadata, hosts, and GitHub URLs in `packages/config`

## Develop

```bash
pnpm install
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

```bash
pnpm build
```

## Links on every page

- Mother repo: [github.com/iresharma/codeloom](https://github.com/iresharma/codeloom)
- Product repo: placeholder GitHub URL per surface (create the repo, the button is already wired)
- [iresharma.com](https://iresharma.com)
- [blog.iresharma.com](https://blog.iresharma.com)

## Splitting into separate websites

Everything is already isolated by product:

1. `packages/config/src/products.ts` holds name, copy, host, path, and GitHub URLs.
2. `packages/ui/src/landings/*` are the full pages.
3. `apps/web` is a thin shell that imports those landings.

To break them apart:

1. Copy `apps/web` to `apps/ide` (or `tui` / `cli`).
2. Keep only the landing you need in `app/page.tsx`.
3. Point that app at the matching host.
4. Set `NEXT_PUBLIC_SPLIT_SITES=true` so cross-product links become `https://*.codeloom.iresharma.com` instead of local routes.

Middleware already rewrites `ide.codeloom.iresharma.com/` → `/ide` (and the same for TUI and CLI), so one Vercel project with multiple domains also works until you fully split.

## License

MIT. These products are not real companies — they are open-source experiments.
