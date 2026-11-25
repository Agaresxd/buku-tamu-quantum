# AI Usage

This project was built with AI assistance, as part of the QoreChain Developer Fest
"Build Before Q-Day" (Intermediate / Post-Quantum dApp track).

## Tools used

- **Muse (Meta)** — an AI coding agent. It was used throughout the build:
  - Scaffolding the dApp from the official Q-Day Guestbook example
    (`create-qorechain-dapp`, Hardhat template).
  - Writing and customising the web app (`web/src/App.tsx`, `web/src/styles.css`):
    English UI, live stats, search/filter, newest/oldest sort, copy-address button,
    ML-DSA-87 badge per entry, and the "How it works" explainer.
  - Writing the deployment and signing scripts' usage flow (register PQC key,
    open EVM window, deploy with Hardhat Ignition, sign).
  - Writing this README, the demo video script (`video-script.md`), the judge
    simulation (`judge-simulation.md`), and the featured image (`featured.webp`,
    generated with an image model).
  - Verifying the build: contract tests (3/3 passing), web typecheck and
    production build, and the on-chain checks of the deployment.

## Human involvement

All decisions were made by the human builder: the project idea, the Intermediate
level, the custom design (gold/terracotta theme), the English-only UI, the
GitHub repository, the QoreChain registration, the faucet claim, the QoreX
signing, and the final submission. The AI never held any private key, recovery
phrase, or account credential: the throwaway testnet account was created locally
and funded by the human, and every on-chain transaction was executed by the
human's own QoreX wallet or by local scripts run with the human's approval.

## Verification

Everything the AI produced was verified against real on-chain state: PQC key
registration, EVM window opening, contract deployment and the first signature
are all real testnet transactions linked in the README.
