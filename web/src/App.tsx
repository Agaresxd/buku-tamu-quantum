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
const REST = `${location.origin}/lcd`; // Proxy Vite ke https://api-testnet.qore.host
const EXPLORER = "https://explore.qore.network/tx/";

const abi = parseAbi([
  "function sign(string message)",
  "function count() view returns (uint256)",
  "function hasSigned(address) view returns (bool)",
  "function latest(uint256 limit) view returns ((address author, uint64 timestamp, string message)[])",
]);

const SOLUSI: Record<EvmWindowRejection, string> = {
  "no-pqc-key": "Akun ini belum punya kunci ML-DSA-87. QoreX mendaftarkannya saat pengiriman native pertama.",
  "no-window": "Belum ada window otorisasi EVM. QoreX menawarkannya saat persetujuan; atau jalankan pnpm window open.",
  exhausted: "Window habis (blok, transaksi, atau nilai) atau terikat ke kontrak lain. Buka window baru.",
  invalid: "Chain menolak parameter window.",
};

const singkat = (a: string) => `${a.slice(0, 8)}...${a.slice(-6)}`;

function waktuRelatif(ts: number) {
  const detik = Math.floor(Date.now() / 1000) - ts;
  if (detik < 60) return "baru saja";
  if (detik < 3600) return `${Math.floor(detik / 60)} menit lalu`;
  if (detik < 86400) return `${Math.floor(detik / 3600)} jam lalu`;
  return new Date(ts * 1000).toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function waktuLengkap(ts: number) {
  return new Date(ts * 1000).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusWindow({ address }: { address: Address }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["evm-window", address],
    queryFn: () => evmWindowStatus({ rest: REST, address }),
    refetchInterval: 5_000,
  });
  if (isLoading) return <span>membaca...</span>;
  if (error) return <span>tidak bisa membaca: {error.message}</span>;
  if (!data?.found) return <span className="pill bad">belum ada window</span>;
  return (
    <span className={data.live ? "pill ok" : "pill bad"}>
      {data.live ? "aktif" : "tidak bisa dipakai"}: {data.remainingBlocks.toString()} blok, {data.remainingTxs.toString()} tx tersisa
    </span>
  );
}

export function App() {
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: block } = useBlockNumber({ watch: true });
  const [message, setMessage] = useState("Halo dari Buku Tamu Quantum!");
  const [cari, setCari] = useState("");
  const [urutTerlama, setUrutTerlama] = useState(false);
  const [tersalin, setTersalin] = useState(false);

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

  const entri = useMemo(() => {
    const semua = latest.data ?? [];
    const kata = cari.trim().toLowerCase();
    const cocok = kata
      ? semua.filter((e) => e.message.toLowerCase().includes(kata) || e.author.toLowerCase().includes(kata))
      : semua;
    return urutTerlama ? [...cocok].reverse() : cocok;
  }, [latest.data, cari, urutTerlama]);

  const penandaUnik = useMemo(
    () => (latest.data ? new Set(latest.data.map((e) => e.author.toLowerCase())).size : undefined),
    [latest.data],
  );
  const terakhir = latest.data?.[0];

  const salinAlamat = async () => {
    if (!GUESTBOOK) return;
    try {
      await navigator.clipboard.writeText(GUESTBOOK);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      /* clipboard tidak tersedia */
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
          <span className="tag">Buku Tamu Quantum</span>
        </div>
        <div className="net">
          <span className="dot" /> EVM 9800 (testnet diana) &middot; blok <b>{block?.toLocaleString("id-ID") ?? "..."}</b>
        </div>
      </header>

      <h1 className="judul">Buku Tamu Quantum</h1>
      <p className="lead">
        Buku tamu di atas kontrak Solidity di EVM QoreChain. Setiap tulisan ditandatangani dengan dua kunci sekaligus —
        secp256k1 dan ML-DSA-87 (post-quantum) — dan hanya bisa dikirim saat window otorisasi EVM sedang terbuka. Jadi
        kunci secp256k1 yang dicuri saja tidak cukup untuk menghabiskan isi akunmu.
      </p>

      {!GUESTBOOK && <div className="error">Atur VITE_GUESTBOOK_ADDRESS di .env (deploy kontrak dulu).</div>}

      <section className="card">
        <h2>
          <span className="n">1</span> Hubungkan QoreX
        </h2>
        <ConnectButton chainStatus="full" showBalance={false} />
        {isConnected && address && (
          <div className="kv">
            <div>Akun</div>
            <code>{address}</code>
            <div>Jaringan</div>
            <span>{chainId === 9800 ? "qorechain-diana EVM (9800)" : `jaringan salah ${chainId}: pindah ke 9800`}</span>
            <div>Saldo</div>
            <span>{balance ? `${Number(formatEther(balance.value)).toLocaleString("id-ID")} QOR` : "..."}</span>
            <div>Window EVM</div>
            <StatusWindow address={address} />
          </div>
        )}
      </section>

      <section className={`card ${isConnected ? "" : "dim"}`}>
        <h2>
          <span className="n">2</span> Tanda tangani buku tamu
        </h2>
        {signed.data ? (
          <p>Alamat ini sudah menandatangani. Terima kasih!</p>
        ) : (
          <>
            <div className="row">
              <input value={message} maxLength={140} onChange={(e) => setMessage(e.target.value)} disabled={!isConnected} />
              <button
                disabled={!isConnected || !GUESTBOOK || write.isPending || !message.trim()}
                onClick={() => write.writeContract({ address: GUESTBOOK!, abi, functionName: "sign", args: [message.trim()] })}
              >
                {write.isPending ? "Setujui di QoreX..." : "Tanda tangani"}
              </button>
            </div>
            <p className="small">{message.length}/140 karakter, satu tanda tangan per alamat.</p>
          </>
        )}
        {write.data && (
          <p className="small">
            tx{" "}
            <a href={`${EXPLORER}${write.data}`} target="_blank" rel="noreferrer">
              <code>{write.data}</code>
            </a>{" "}
            {receipt.isLoading ? "menunggu blok..." : receipt.data ? `${receipt.data.status} di blok ${receipt.data.blockNumber}` : ""}
          </p>
        )}
        {write.error && <div className="error">Ditolak: {rejection ? SOLUSI[rejection] : write.error.message.split("\n")[0]}</div>}
      </section>

      <section className="card">
        <h2>
          <span className="n">3</span> Di chain sekarang: {count.data?.toString() ?? "..."} tanda tangan
        </h2>
        {GUESTBOOK && (
          <p className="small">
            Kontrak <code>{GUESTBOOK}</code>{" "}
            <button className="copybtn" onClick={salinAlamat}>
              {tersalin ? "Tersalin!" : "Salin alamat"}
            </button>
          </p>
        )}
        <div className="stats">
          <div className="stat">
            <b>{count.data?.toString() ?? "..."}</b>
            <span>total tanda tangan</span>
          </div>
          <div className="stat">
            <b>{penandaUnik ?? "..."}</b>
            <span>penanda tangan unik (20 terakhir)</span>
          </div>
          <div className="stat">
            <b>{terakhir ? waktuRelatif(Number(terakhir.timestamp)) : "..."}</b>
            <span>tanda tangan terakhir</span>
          </div>
        </div>
        <div className="toolbar">
          <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari pesan atau alamat..." aria-label="Cari pesan" />
          <button className="ghost" onClick={() => setUrutTerlama((v) => !v)}>
            {urutTerlama ? "Terlama dulu" : "Terbaru dulu"}
          </button>
        </div>
        <div className="entries">
          {entri.map((e, i) => (
            <div key={`${e.author}-${i}`} className="entry">
              <div className="msg">{e.message}</div>
              <div className="meta">
                <code>{singkat(e.author)}</code> &middot; <span title={waktuLengkap(Number(e.timestamp))}>{waktuRelatif(Number(e.timestamp))}</span>
                <span className="badge-pq">ML-DSA-87 ✓</span>
              </div>
            </div>
          ))}
          {entri.length === 0 && latest.data && latest.data.length > 0 && <p className="small">Tidak ada yang cocok dengan pencarianmu.</p>}
          {latest.data?.length === 0 && <p className="small">Belum ada yang menandatangani. Jadilah yang pertama.</p>}
        </div>
      </section>

      <section className="card how">
        <h2>
          <span className="n">?</span> Cara kerjanya
        </h2>
        <ol>
          <li>
            <b>Daftarkan kunci ML-DSA-87</b> — sekali per akun, lewat transaksi hybrid pertama. Kunci post-quantum ini yang
            membuat tanda tanganmu tahan terhadap komputer kuantum.
          </li>
          <li>
            <b>Buka window EVM</b> — otorisasi terbatas (misalnya 600 blok, 5 transaksi). Di luar window itu, transaksi EVM
            dari akunmu ditolak chain.
          </li>
          <li>
            <b>Tanda tangani</b> — pesanmu tercatat di kontrak, lengkap dengan alamat dan waktunya, dan bisa dibaca siapa pun
            dari chain.
          </li>
        </ol>
      </section>

      <footer>Testnet saja. QOR testnet tidak bernilai. Dibangun untuk Build Before Q-Day — QoreChain.</footer>
    </div>
  );
}
