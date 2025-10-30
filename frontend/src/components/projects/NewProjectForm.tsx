import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDeployProject } from '../../hooks/useDeployProject';

export default function NewProjectForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [jurisdiction, setJurisdiction] = useState('AU');
  const [metadataUri, setMetadataUri] = useState('');

  const {
    deploy,
    txHash,
    newProject,
    isPending,
    confirming,
    isSuccess,
    writeError,
  } = useDeployProject();

  const router = useRouter();

  useEffect(() => {
    if (isSuccess && newProject) {
      // Example: redirect to home or detail page after success
      // router.push('/');
    }
  }, [isSuccess, newProject, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !propertyId || !jurisdiction || !metadataUri) return;
    deploy({ name, symbol, propertyId, jurisdiction, metadataUri });
  };

  const field = {
    display: 'block',
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: 4,
    marginBottom: 12,
  } as const;

  return (
    <form onSubmit={submit} className="stack" style={{maxWidth:560}}>
      <div className="stack">
        <div className="label">Name</div>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="input" required />
      </div>
      <div className="stack">
        <div className="label">Symbol</div>
        <input value={symbol} onChange={(e)=>setSymbol(e.target.value)} className="input" required />
      </div>
      <div className="stack">
        <div className="label">Property ID</div>
        <input value={propertyId} onChange={(e)=>setPropertyId(e.target.value)} placeholder="SYD-RESI-1" className="input" required />
      </div>
      <div className="stack">
        <div className="label">Jurisdiction</div>
        <input value={jurisdiction} onChange={(e)=>setJurisdiction(e.target.value)} placeholder="AU" className="input" required />
      </div>
      <div className="stack">
        <div className="label">Metadata URI</div>
        <input value={metadataUri} onChange={(e)=>setMetadataUri(e.target.value)} placeholder="ipfs://…" className="input" required />
      </div>
  
      <div className="row">
        <button type="submit" disabled={isPending || confirming} className="btn btn-primary">
          {isPending ? 'Sending…' : confirming ? 'Confirming…' : 'Create Project'}
        </button>
        {txHash && (
          <span className="row">
            <span className="label">Tx</span>
            <a href={`https://mantrascan.io/dukong/tx/${txHash}`} target="_blank" rel="noreferrer" className="kbd">View on MantraScan</a>
          </span>
        )}
        {newProject && (
          <span className="row">
            <span className="label">New Contract</span>
            <a href={`https://mantrascan.io/dukong/address/${newProject}`} target="_blank" rel="noreferrer" className="kbd mono">{newProject}</a>
          </span>
        )}
      </div>
  
      {writeError && <div style={{color:'var(--danger)'}}>{String(writeError.shortMessage || writeError.message)}</div>}
    </form>
  );
  // return (
  //   <form onSubmit={submit} style={{ maxWidth: 560 }}>
  //     <label>
  //       <div>Name</div>
  //       <input
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //         style={field}
  //         required
  //       />
  //     </label>

  //     <label>
  //       <div>Symbol</div>
  //       <input
  //         value={symbol}
  //         onChange={(e) => setSymbol(e.target.value)}
  //         style={field}
  //         required
  //       />
  //     </label>

  //     <label>
  //       <div>Property ID</div>
  //       <input
  //         value={propertyId}
  //         onChange={(e) => setPropertyId(e.target.value)}
  //         style={field}
  //         placeholder="SYD-RESI-1"
  //         required
  //       />
  //     </label>

  //     <label>
  //       <div>Jurisdiction</div>
  //       <input
  //         value={jurisdiction}
  //         onChange={(e) => setJurisdiction(e.target.value)}
  //         style={field}
  //         placeholder="AU"
  //         required
  //       />
  //     </label>

  //     <label>
  //       <div>Metadata URI</div>
  //       <input
  //         value={metadataUri}
  //         onChange={(e) => setMetadataUri(e.target.value)}
  //         style={field}
  //         placeholder="ipfs://..."
  //         required
  //       />
  //     </label>

  //     <button
  //       type="submit"
  //       disabled={isPending || confirming}
  //       style={{
  //         background: '#111',
  //         color: '#fff',
  //         border: 'none',
  //         borderRadius: 4,
  //         padding: '0.5rem 0.75rem',
  //         cursor: 'pointer',
  //       }}
  //     >
  //       {isPending ? 'Sending…' : confirming ? 'Confirming…' : 'Create Project'}
  //     </button>

  //     {txHash && (
  //       <div style={{ marginTop: 8, wordBreak: 'break-all' }}>
  //         <strong>Tx:</strong>{' '}
  //         <a
  //           href={`https://mantrascan.io/dukong/tx/${txHash}`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           View on MantraScan
  //         </a>
  //       </div>
  //     )}

  //     {newProject && (
  //       <div style={{ marginTop: 8, wordBreak: 'break-all' }}>
  //         <strong>New Project:</strong>{' '}
  //         <a
  //           href={`https://mantrascan.io/dukong/address/${newProject}`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           {newProject}
  //         </a>
  //       </div>
  //     )}

  //     {writeError && (
  //       <div style={{ marginTop: 8, color: '#b00020' }}>
  //         {String(writeError.shortMessage || writeError.message)}
  //       </div>
  //     )}
  //   </form>
  // );
}
