# CodeLoom pages

A single site for the CodeLoom family — an educational / resume project by [Iresh Sharma](https://iresharma.com).

One Next.js app, routed by section. Shared copy and UI live in `packages/` so the sections stay visually consistent.

| Section | Route | Status |
| --- | --- | --- |
| Engine | `/engine` | Shipping — the JSON-IPC Unix server |
| Cloud Controller | `/cloud-controller` | Concept — fleet control for cloud agents |
| Clients | `/clients` | In development — web client (featured) + TUI |

## Stack

- pnpm workspaces + Turborepo
- Next.js 15 (App Router) in `apps/web`
- Shared UI in `packages/ui`
- Section metadata and GitHub URLs in `packages/config`

## Develop

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

```bash
pnpm build
```

## Deploy

One Railway service in the `codeloom` project, building and starting with `pnpm --filter @codeloom/web`. Custom domain is attached in the Railway UI.

## Links on every page

- Mother repo: [github.com/iresharma/codeloom](https://github.com/iresharma/codeloom)
- Product repo: placeholder GitHub URL per surface (create the repo, the button is already wired)
- [iresharma.com](https://iresharma.com)
- [blog.iresharma.com](https://blog.iresharma.com)

## License

MIT. These products are not real companies — they are open-source experiments.
