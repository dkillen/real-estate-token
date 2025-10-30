import Head from 'next/head';
import { useState, useMemo, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { useOwnedProjects } from '../../hooks/useOwnedProjects';
import { useRETDetails } from '../../hooks/useRETDetails';
import { useRETWrite } from '../../hooks/useRETWrite';
import { useAccount } from 'wagmi';

type Addr = `0x${string}`;

export default function ManageProjectsPage() {
  const { address: connected } = useAccount();
  const { projectsOwned, isLoading } = useOwnedProjects();
  const [selected, setSelected] = useState<Addr | ''>('');

  const tokenAddr = useMemo(() => (selected ? (selected as Addr) : undefined), [selected]);

  const { meta, shareholders, refetchBalances, refetchShareholders } = useRETDetails(tokenAddr);
  const { mint, adminBurn, txHash, isSuccess, confirming, isPending, writeError } = useRETWrite(tokenAddr);

  // refresh balances on success
  useEffect(() => { if (isSuccess) { refetchBalances(); refetchShareholders(); } }, [isSuccess, refetchBalances, refetchShareholders]);


  const [mintTo, setMintTo] = useState('');
  const [mintAmt, setMintAmt] = useState<number | ''>('');
  const [burnFrom, setBurnFrom] = useState('');
  const [burnAmt, setBurnAmt] = useState<number | ''>('');

  const field = { width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: 6 } as const;
  const btn = { padding: '8px 12px', borderRadius: 6, border: 'none', background: '#111', color: '#fff', cursor: 'pointer' } as const;
  const card = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 } as const;

  const canMint = tokenAddr && mintTo && typeof mintAmt === 'number' && mintAmt > 0;
  const canBurn = tokenAddr && burnFrom && typeof burnAmt === 'number' && burnAmt > 0;

  return (
    <>
      <Head><title>Manage Projects</title></Head>
      <Header />

      <main className="container stack">
        <section className="card stack">
          <h2 style={{margin:0}}>Select Your Project</h2>
          {isLoading ? <div className="badge">Loading…</div> :
            projectsOwned.length === 0 ? <div className="badge">No owned projects</div> :
            <select value={selected} onChange={(e)=>setSelected(e.target.value as Addr)} className="select">
              <option value="">— Select —</option>
              {projectsOwned.map((addr)=>(<option key={addr} value={addr}>{addr}</option>))}
            </select>
          }
        </section>

        {tokenAddr && (
          <section className="card stack">
            <h2 style={{margin:0}}>Project Details</h2>
            <div className="grid-2-narrow">
              <div><div className="label">Address</div><div className="mono">{tokenAddr}</div></div>
              <div><div className="label">Name</div><div>{meta.name ?? '—'}</div></div>
              <div><div className="label">Symbol</div><div>{meta.symbol ?? '—'}</div></div>
              <div><div className="label">Property ID</div><div>{meta.propertyId ?? '—'}</div></div>
              <div><div className="label">Jurisdiction</div><div>{meta.jurisdiction ?? '—'}</div></div>
              <div><div className="label">Metadata URI</div><div className="mono">{meta.metadataUri ?? '—'}</div></div>
              <div><div className="label">Total Supply</div><div>{meta.totalSupply?.toString() ?? '0'} (decimals {meta.decimals})</div></div>
            </div>
          </section>
        )}

        {tokenAddr && (
          <section className="card" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--gap)'}}>
            {/* Mint */}
            <div className="stack">
              <h3 style={{margin:0}}>Mint</h3>
              <div className="stack">
                <div className="label">Investor Address</div>
                <input value={mintTo} onChange={(e)=>setMintTo(e.target.value.trim())} className="input" placeholder="0x…" />
              </div>
              <div className="stack">
                <div className="label">Amount (whole shares)</div>
                <input type="number" min={1} step={1} value={mintAmt} onChange={(e)=>setMintAmt(e.target.value?Number(e.target.value):'')} className="input" />
              </div>
              <button className="btn btn-primary" disabled={!canMint || isPending || confirming}
                onClick={()=>mint(mintTo as Addr, BigInt(mintAmt as number))}>
                {isPending ? 'Sending…' : confirming ? 'Confirming…' : 'Mint'}
              </button>
            </div>

            {/* Burn */}
            <div className="stack">
              <h3 style={{margin:0}}>Admin Burn</h3>
              <div className="stack">
                <div className="label">Holder Address</div>
                <input value={burnFrom} onChange={(e)=>setBurnFrom(e.target.value.trim())} className="input" placeholder="0x…" />
              </div>
              <div className="stack">
                <div className="label">Amount (whole shares)</div>
                <input type="number" min={1} step={1} value={burnAmt} onChange={(e)=>setBurnAmt(e.target.value?Number(e.target.value):'')} className="input" />
              </div>
              <button className="btn btn-danger" disabled={!canBurn || isPending || confirming}
                onClick={()=>adminBurn(burnFrom as Addr, BigInt(burnAmt as number))}>
                {isPending ? 'Sending…' : confirming ? 'Confirming…' : 'Burn'}
              </button>
            </div>
          </section>
        )}

        {tokenAddr && (
          <section className="card stack">
            <h2 style={{margin:0}}>Investors & Holdings</h2>
            {shareholders.length===0 ? (
              <div className="badge">No shareholders yet</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th style={{textAlign:'right'}}>Balance</th>
                    <th>Explorer</th>
                  </tr>
                </thead>
                <tbody>
                  {shareholders.map((s)=>(
                    <tr key={s.address}>
                      <td className="mono">{s.address}</td>
                      <td style={{textAlign:'right'}}>{s.balance.toString()}</td>
                      <td><a href={`https://mantrascan.io/dukong/address/${s.address}`} target="_blank" rel="noreferrer">View</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>
    </>
  );
}
