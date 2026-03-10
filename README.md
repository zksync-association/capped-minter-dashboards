# Capped Minter Dashboard

A Next.js dashboard for viewing and managing capped minter programs on zkSync (mainnet and Sepolia testnet). View program trees, usage, and deploy new Capped Minter V3, Delay, and Rate Limit minter contracts.

## Features

- **Program tree view** – Interactive graph of a selected program’s minter hierarchy
- **Programs table** – List of programs with status, usage, and links to proposals
- **Wallet connect** – RainbowKit + Wagmi for connecting wallets on zkSync
- **Deploy flows** – Deploy Capped Minter V3, Delay Minter, and Rate Limit Minter from the header
- **Theme** – Light/dark mode with next-themes

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [RainbowKit](https://rainbowkit.com) + [Wagmi](https://wagmi.dev) + [viem](https://viem.sh)
- [TanStack Query](https://tanstack.com/query) & [TanStack Table](https://tanstack.com/table)
- [React Flow](https://reactflow.dev) (program tree graph)
- [Tailwind CSS](https://tailwindcss.com), [Radix UI](https://radix-ui.com), [shadcn/ui](https://ui.shadcn.com)

## Getting started

### Prerequisites

- [Bun](https://bun.sh) (Node.js 18+ is also supported if you prefer npm/pnpm/yarn)

### Install and run

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit the [**How to**](/how-to) route ([http://localhost:3000/how-to](http://localhost:3000/how-to)) to see how to use the app.

### Environment variables

Create a `.env.local` (or `.env`) in the project root:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CHAIN_ID` | No | Chain ID: `324` (zkSync mainnet) or `300` (zkSync Sepolia). Defaults to `324`. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes (for WalletConnect) | [WalletConnect Cloud](https://cloud.walletconnect.com) project ID. |
| `NEXT_PUBLIC_SUBGRAPH_URL` | No | Subgraph URL for mainnet program list and program tree data. If unset, mainnet programs are hidden and tree data uses RPC only where possible. The subgraph is sourced from [ScopeLift/capped-minter-dashboard-subgraph](https://github.com/ScopeLift/capped-minter-dashboard-subgraph). |
| `NEXT_PUBLIC_GOVERNANCE_PROPOSAL_BASE_URL` | No | Base URL for governance proposal links (e.g. Tally). Defaults to `https://www.tally.xyz/gov/zksync/proposal/`. |

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the Next.js dev server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Run TypeScript check |
| `bun test` | Run tests |

## Project structure

- `app/` – Next.js App Router pages and layout (`page.tsx`, `header`, `providers`, deploy pages, etc.)
- `app/programs/` – Programs table and program tree view
- `components/` – Shared UI (e.g. `program-flow` graph, shadcn components)
- `lib/` – Wagmi config, ABIs, hooks (`useCappedMinterData`, `useProgramTree`, `useMainnetPrograms`, etc.), subgraph client, utils
- `data/` – Testnet program list

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [RainbowKit](https://rainbowkit.com) / [Wagmi](https://wagmi.dev)
- [zkSync](https://zksync.io)
