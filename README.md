# CodeLoom pages

Coming-soon landing pages for the CodeLoom family — an educational / resume project by [Iresh Sharma](https://iresharma.com).

Each product is its own Next.js app. Shared copy and UI live in `packages/` so the sites stay visually consistent without sharing a server.

| Product | App | Host |
| --- | --- | --- |
| CodeLoom agent | `apps/agent` | [codeloom.iresharma.com](https://codeloom.iresharma.com) |
| CodeLoom IDE | `apps/ide` | [ide.codeloom.iresharma.com](https://ide.codeloom.iresharma.com) |
| CodeLoom TUI | `apps/tui` | [tui.codeloom.iresharma.com](https://tui.codeloom.iresharma.com) |
| CodeLoom CLI | `apps/cli` | [cli.codeloom.iresharma.com](https://cli.codeloom.iresharma.com) |
| CodeLoom Engine | `apps/engine` | [engine.codeloom.iresharma.com](https://engine.codeloom.iresharma.com) |

Cross-product links use those hosts in production, and `localhost:3000`–`3004` during `pnpm dev`.

## Stack

- pnpm workspaces + Turborepo
- Next.js 15 (App Router) in `apps/*`
- Shared UI in `packages/ui`
- Product metadata, hosts, and GitHub URLs in `packages/config`

## Develop

```bash
pnpm install
pnpm dev
```

| App | Local URL |
| --- | --- |
| Agent | [http://localhost:3000](http://localhost:3000) |
| IDE | [http://localhost:3001](http://localhost:3001) |
| TUI | [http://localhost:3002](http://localhost:3002) |
| CLI | [http://localhost:3003](http://localhost:3003) |
| Engine | [http://localhost:3004](http://localhost:3004) |

```bash
pnpm build
```

## Deploy

### Railway

Five Railway services in the `codeloom` project, one per app. Each service builds and starts with `pnpm --filter @codeloom/<app>`. Custom domains are attached in the Railway UI.

### Docker

Each app is a standalone Next.js server on port 3000. One Dockerfile, five images — pass `APP`:

```bash
for app in agent ide tui cli engine; do
  docker build --platform linux/amd64 --build-arg APP=$app \
    -t iresharma/codeloom-$app:0.1.0 .
done
```

| App | Image |
| --- | --- |
| Agent | `iresharma/codeloom-agent` |
| IDE | `iresharma/codeloom-ide` |
| TUI | `iresharma/codeloom-tui` |
| CLI | `iresharma/codeloom-cli` |
| Engine | `iresharma/codeloom-engine` |

```bash
docker run --rm -p 3000:3000 iresharma/codeloom-agent:0.1.0
```

## Links on every page

- Mother repo: [github.com/iresharma/codeloom](https://github.com/iresharma/codeloom)
- Product repo: placeholder GitHub URL per surface (create the repo, the button is already wired)
- [iresharma.com](https://iresharma.com)
- [blog.iresharma.com](https://blog.iresharma.com)

## License

MIT. These products are not real companies — they are open-source experiments.
