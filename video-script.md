# Demo Video Script — Quantum Guestbook

Target length: **~2:40** (fest limit: 3 minutes). Record screen + voice yourself — Muse cannot generate video.
Language: English. Record at 1080p, browser zoom 100%, notifications off.

## Scene 1 — Opening (0:00–0:15)
**Show:** the Quantum Guestbook web page (localhost:5174 or the deployed version).
**Say:**
> "Hi, this is Quantum Guestbook — a post-quantum guestbook on QoreChain, built for Build Before Q-Day."

## Scene 2 — The problem (0:15–0:45)
**Show:** stay on the main page, move the cursor to the 'How it works' section.
**Say:**
> "An ordinary wallet key, secp256k1, could one day be broken by a quantum computer. QoreChain solves this with hybrid signing: every transaction is signed with two keys at once — secp256k1 and ML-DSA-87 — and can only be sent while an EVM authorisation window is open. A stolen key alone is not enough."

## Scene 3 — Web demo (0:45–1:20)
**Show:** the live demo page (https://agaresxd.github.io/buku-tamu-quantum/) — scroll through the 3 on-chain entries from 3 different addresses, show the stats row, then click Connect Wallet to show the QoreX connection (note: live signing from a phone is not possible — the QoreX mobile dApp browser's EVM provider is read-only by design, so the signing itself is shown via the entries already on-chain; signing works from a desktop browser with the QoreX extension).
**Say:**
> "On the web, a visitor just connects QoreX and signs. QoreX registers the ML-DSA-87 key and opens the window itself inside the approval. Three signatures from three different addresses are already on-chain."

## Scene 4 — Proof on-chain (1:20–1:50)
**Show:** open the explorer (explore.qore.network, Testnet tab) → contract address `0x1D71b23650B30558F9C6aDAf916382b243ECFb55` → show the first signature transaction (block 10718571) and the entry list.
**Say:**
> "Here is the proof in the explorer: the contract is deployed, and the first signature is recorded in block 10718571. These are real testnet transactions, not mocks."

## Scene 5 — Features (1:50–2:20)
**Show:** click the stats, type in the search box, switch Newest/Oldest order, click "Copy address".
**Say:**
> "The app is in English, with signature stats, message search, newest-or-oldest ordering, and a how-it-works explainer for hybrid signing. Not a copy of the tutorial example — the design and features were built from scratch."

## Scene 6 — Closing (2:20–2:40)
**Show:** back to the main page, then show the repo README (or an end screen with links).
**Say:**
> "Quantum Guestbook — the repository and contract address are in the description. Thank you, and see you on Q-Day."

## Checklist before recording
- [ ] QoreX on testnet, enough QOR balance (window + 1 signature).
- [ ] The web page already shows the existing entries.
- [ ] Explorer tab already open at the contract address.
- [ ] Notifications off on phone/computer; close unneeded tabs.
- [ ] Record in one take; if you mis-speak, just repeat the sentence and cut it in editing.
