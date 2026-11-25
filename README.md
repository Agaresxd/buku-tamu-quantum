# Quantum Guestbook

![Quantum Guestbook](featured.webp)

**A post-quantum guestbook on QoreChain — every signature is hybrid-signed (secp256k1 + ML-DSA-87) and only possible inside an open EVM authorisation window.**

Built for **QoreChain Developer Fest — "Build Before Q-Day"** (Intermediate / Post-Quantum dApp track).

## What it is

Visitors connect their QoreX wallet and sign the guestbook. Each signature is a transaction on the QoreChain EVM (testnet `qorechain-diana`, chain ID 9800) that:

1. **Registers an ML-DSA-87 key** — once per account, via the first hybrid transaction.
2. **Opens an EVM authorisation window** — a limited authorisation (e.g. 600 blocks, 5 txs). Outside the window, EVM transactions from the account are rejected by the chain.
3. **Signs the guestbook** — the message, author address and timestamp are stored on-chain in the `QDayGuestbook` contract and readable by anyone.

A stolen secp256k1 key alone cannot spend from the account: every EVM write also needs the post-quantum key and a live window.

## Live deployment (testnet)

- **Contract:** `QDayGuestbook` — [`0x1D71b23650B30558F9C6aDAf916382b243ECFb55`](https://explore.qore.network/address/0x1D71b23650B30558F9C6aDAf916382b243ECFb55)
- **Network:** QoreChain testnet `qorechain-diana` (EVM chain ID 9800)
- **First signature:** tx [`0xf3e84269c428671e4875b49a880fe1070d4b633d1887719388638ac7a7d5a830`](https://explore.qore.network/tx/0xf3e84269c428671e4875b49a880fe1070d4b633d1887719388638ac7a7d5a830) — "Halo dari Buku Tamu Quantum!", block 10718571

## Project layout

```
buku-tamu-quantum/
├── contracts-app/   # Solidity + Hardhat: QDayGuestbook contract, deploy & sign scripts
│   ├── contracts/QDayGuestbook.sol
│   ├── ignition/modules/QDayGuestbook.ts
│   ├── scripts/window.ts   # register PQC key, open/status EVM window
│   └── scripts/sign.ts     # sign from the terminal, read entries
└── web/             # Vite + React + wagmi + RainbowKit + QoreX wallet
    └── src/App.tsx  # English UI: stats, search, sort, copy address, how-it-works
```

## Run it yourself

Prerequisites: Node.js ≥ 22.13, pnpm, a QoreX wallet on testnet, test QOR from the [faucet](https://dashboard.qorechain.io/faucet).

```bash
# 1. Contract (tests)
cd contracts-app
pnpm install
pnpm test            # 3 passing

# 2. Deploy your own instance (needs a funded throwaway account in .env)
cp .env.example .env   # fill PRIVATE_KEY + QORE_PQC_RECOVERY_CODE
pnpm window register
pnpm window open
pnpm deploy:testnet
pnpm sign "Hello from Quantum Guestbook!"

# 3. Web
cd ../web
pnpm install
cp .env.example .env   # set VITE_GUESTBOOK_ADDRESS to the deployed contract
pnpm dev               # http://localhost:5174
```

Never use a real wallet or recovery phrase for testnet work — throwaway accounts only.

## What makes it different from the tutorial

This project started from the official Q-Day Guestbook example and was customised into its own dApp:

- **English UI** throughout (the example is in English too, but this one was rewritten with its own copy).
- **Own design** — warm gold/terracotta theme instead of the example's purple/teal.
- **Extra features:** live stats (total signatures, unique signers, last signature in relative time), search/filter by message or address, newest/oldest sort, copy-contract-address button, ML-DSA-87 badge per entry, and a "How it works" explainer of hybrid signing.
- **Verified end-to-end on testnet:** key registration, window opening, contract deployment and the first signature are all real on-chain transactions (see links above).

## License

MIT — see [LICENSE](LICENSE).
