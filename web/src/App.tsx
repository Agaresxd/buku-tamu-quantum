import { ConnectButton } from "@rainbow-me/rainbowkit";
import { classifyEvmWindowRejection, evmWindowStatus, type EvmWindowRejection } from "@qorechain/evm";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { formatEther, parseAbi, type Address } from "viem";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const GUESTBOOK = import.meta.env.VITE_GUESTBOOK_ADDRESS as Address | undefined;
const REST = `${location.origin}/lcd`; // Vite proxy to https://api-testnet.qore.host
const EXPLORER = "https://explore.qore.network/tx/";
// Static hosts (e.g. GitHub Pages) have no /lcd proxy and the REST endpoint
// sends no CORS headers, so the window status cannot be read there. Hide it
// in static builds (VITE_HIDE_WINDOW_STATUS=true); local dev keeps it.
const HIDE_WINDOW = import.meta.env.VITE_HIDE_WINDOW_STATUS === "true";

const abi = parseAbi([
  "function sign(string message)",
  "function count() view returns (uint256)",
  "function hasSigned(address) view returns (bool)",
  "function latest(uint256 limit) view returns ((address author, uint64 timestamp, string message)[])",
]);

const REMEDY: Record<EvmWindowRejection, string> = {
  "no-pqc-key": "This account has no registered ML-DSA-87 key yet. QoreX registers it on the first native send.",
  "no-window": "No EVM authorisation window is open. QoreX offers to open one in the approval; or run pnpm window open.",
  exhausted: "The window ran out of blocks, transactions or value (or it is scoped to another contract). Open a new one.",
  invalid: "The chain refused the window parameters.",
};

const short = (a: string) => `${a.slice(0, 8)}...${a.slice(-6)}`;

function relativeTime(ts: number) {
  const seconds = Math.floor(Date.now() / 1000) - ts;
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fullTime(ts: number) {
  return new Date(ts * 1000).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WindowStatus({ address }: { address: Address }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["evm-window", address],
    queryFn: () => evmWindowStatus({ rest: REST, address }),
    refetchInterval: 5_000,
  });
  if (isLoading) return <span>loading...</span>;
  if (error) return <span>could not load: {error.message}</span>;
  if (!data?.found) return <span className="pill bad">no window open</span>;
  return (
    <span className={data.live ? "pill ok" : "pill bad"}>
      {data.live ? "live" : "not usable"}: {data.remainingBlocks.toString()} blocks, {data.remainingTxs.toString()} txs left
    </span>
  );
}

export function App() {
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: block } = useBlockNumber({ watch: true });
  const [message, setMessage] = useState("Hello from Quantum Guestbook!");
  const [query, setQuery] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const [copied, setCopied] = useState(false);

  const count = useReadContract({ address: GUESTBOOK, abi, functionName: "count", query: { enabled: !!GUESTBOOK, refetchInterval: 4000 } });
  const latest = useReadContract({ address: GUESTBOOK, abi, functionName: "latest", args: [20n], query: { enabled: !!GUESTBOOK, refetchInterval: 4000 } });
  const signed = useReadContract({
    address: GUESTBOOK,
    abi,
    functionName: "hasSigned",
    args: address ? [address] : undefined,
    query: { enabled: !!GUESTBOOK && !!address, refetchInterval: 4000 },
  });

  const write = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });
  const rejection = write.error ? classifyEvmWindowRejection(write.error) : undefined;
  // EIP-1193 4100: the wallet refused the method/account. On QoreX this is
  // the usual sign of a default Cosmos (coin 118) account, which cannot sign
  // EVM transactions — only an Ethereum account (coin 60) can.
  const notAuthorized = !!write.error && /not been authorized|4100/.test(write.error.message ?? "");

  const entries = useMemo(() => {
    const all = latest.data ?? [];
    const q = query.trim().toLowerCase();
    const matched = q
      ? all.filter((e) => e.message.toLowerCase().includes(q) || e.author.toLowerCase().includes(q))
      : all;
    return oldestFirst ? [...matched].reverse() : matched;
  }, [latest.data, query, oldestFirst]);

  const uniqueSigners = useMemo(
    () => (latest.data ? new Set(latest.data.map((e) => e.author.toLowerCase())).size : undefined),
    [latest.data],
  );
  const last = latest.data?.[0];

  const copyAddress = async () => {
    if (!GUESTBOOK) return;
    try {
      await navigator.clipboard.writeText(GUESTBOOK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <img src="/qc-icon.png" alt="" width={32} height={32} />
          <span className="wordmark">
            <b>QORE</b>CHAIN
          </span>
          <span className="tag">Quantum Guestbook</span>
        </div>
        <div className="net">
          <span className="dot" /> EVM 9800 (diana testnet) &middot; block <b>{block?.toLocaleString("en-US") ?? "..."}</b>
        </div>
      </header>

      <h1 className="judul">Quantum Guestbook</h1>
      <p className="lead">
        A guestbook on a Solidity contract on the QoreChain EVM. Every entry is signed with two keys at once —
        secp256k1 and ML-DSA-87 (post-quantum) — and can only be sent while an EVM authorisation window is open. So
        a stolen secp256k1 key alone cannot drain the account.
      </p>

      {!GUESTBOOK && <div className="error">Set VITE_GUESTBOOK_ADDRESS in .env (deploy the contract first).</div>}

      <section className="card">
        <h2>
          <span className="n">1</span> Connect QoreX
        </h2>
        <ConnectButton chainStatus="full" showBalance={false} />
        {isConnected && address && (
          <div className="kv">
            <div>Account</div>
            <code>{address}</code>
            <div>Network</div>
            <span>{chainId === 9800 ? "qorechain-diana EVM (9800)" : `wrong network ${chainId}: switch to 9800`}</span>
            <div>Balance</div>
            <span>{balance ? `${Number(formatEther(balance.value)).toLocaleString("en-US")} QOR` : "..."}</span>
            {!HIDE_WINDOW && (
              <>
                <div>EVM window</div>
                <WindowStatus address={address} />
              </>
            )}
          </div>
        )}
      </section>

      <section className={`card ${isConnected ? "" : "dim"}`}>
        <h2>
          <span className="n">2</span> Sign the guestbook
        </h2>
        {signed.data ? (
          <p>This address has already signed. Thank you!</p>
        ) : (
          <>
            <div className="row">
              <input value={message} maxLength={140} onChange={(e) => setMessage(e.target.value)} disabled={!isConnected} />
              <button
                disabled={!isConnected || !GUESTBOOK || write.isPending || !message.trim()}
                onClick={() => write.writeContract({ address: GUESTBOOK!, abi, functionName: "sign", args: [message.trim()] })}
              >
                {write.isPending ? "Approve in QoreX..." : "Sign"}
              </button>
            </div>
            <p className="small">{message.length}/140 characters, one signature per address.</p>
            <p className="small">
              Signing needs an Ethereum account (coin 60) in QoreX — a default Cosmos account cannot sign EVM
              transactions. Add one under Your accounts, fund it, select it, then open the EVM window.
            </p>
          </>
        )}
        {write.data && (
          <p className="small">
            tx{" "}
            <a href={`${EXPLORER}${write.data}`} target="_blank" rel="noreferrer">
              <code>{write.data}</code>
            </a>{" "}
            {receipt.isLoading ? "waiting for the block..." : receipt.data ? `${receipt.data.status} in block ${receipt.data.blockNumber}` : ""}
          </p>
        )}
        {write.error && (
          <div className="error">
            {rejection
              ? `Rejected: ${REMEDY[rejection]}`
              : notAuthorized
                ? "QoreX refused: this account cannot sign EVM transactions. In QoreX, add an Ethereum account (coin 60) under Your accounts, fund it, select it, then open the EVM window (Home card “MetaMask on QoreChain”, or Settings → Security → EVM access window) and try again."
                : `Rejected: ${write.error.message.split("\n")[0]}`}
          </div>
        )}
      </section>

      <section className="card">
        <h2>
          <span className="n">3</span> On chain now: {count.data?.toString() ?? "..."} signatures
        </h2>
        {GUESTBOOK && (
          <p className="small">
            Contract <code>{GUESTBOOK}</code>{" "}
            <button className="copybtn" onClick={copyAddress}>
              {copied ? "Copied!" : "Copy address"}
            </button>
          </p>
        )}
        <div className="stats">
          <div className="stat">
            <b>{count.data?.toString() ?? "..."}</b>
            <span>total signatures</span>
          </div>
          <div className="stat">
            <b>{uniqueSigners ?? "..."}</b>
            <span>unique signers (latest 20)</span>
          </div>
          <div className="stat">
            <b>{last ? relativeTime(Number(last.timestamp)) : "..."}</b>
            <span>latest signature</span>
          </div>
        </div>
        <div className="toolbar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages or addresses..." aria-label="Search messages" />
          <button className="ghost" onClick={() => setOldestFirst((v) => !v)}>
            {oldestFirst ? "Oldest first" : "Newest first"}
          </button>
        </div>
        <div className="entries">
          {entries.map((e, i) => (
            <div key={`${e.author}-${i}`} className="entry">
              <div className="msg">{e.message}</div>
              <div className="meta">
                <code>{short(e.author)}</code> &middot; <span title={fullTime(Number(e.timestamp))}>{relativeTime(Number(e.timestamp))}</span>
                <span className="badge-pq">ML-DSA-87 ✓</span>
              </div>
            </div>
          ))}
          {entries.length === 0 && latest.data && latest.data.length > 0 && <p className="small">No matches for your search.</p>}
          {latest.data?.length === 0 && <p className="small">No signatures yet. Be the first to sign.</p>}
        </div>
      </section>

      <section className="card how">
        <h2>
          <span className="n">?</span> How it works
        </h2>
        <ol>
          <li>
            <b>Register an ML-DSA-87 key</b> — once per account, via the first hybrid transaction. This post-quantum key
            is what makes your signature resistant to quantum computers.
          </li>
          <li>
            <b>Open an EVM window</b> — a limited authorisation (for example 600 blocks, 5 transactions). Outside the
            window, EVM transactions from your account are rejected by the chain.
          </li>
          <li>
            <b>Sign</b> — your message is recorded in the contract, together with your address and its timestamp, and
            anyone can read it from the chain.
          </li>
        </ol>
      </section>

      <footer>Testnet only. Testnet QOR has no value. Built for Build Before Q-Day — QoreChain.</footer>
    </div>
  );
}
