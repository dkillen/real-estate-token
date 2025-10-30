import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { whitelistAbi } from '../../lib/abis/whitelist';
import { WHITELIST_ADDRESS } from '../../lib/addresses';
import { isHexAddress } from '../../utils/address';
import { useWhitelist } from '../../hooks/useWhitelist';
import { useProjects } from '../../hooks/useProjects';
import { useProjectOptions } from '../../hooks/useProjectOptions';


export default function ApproveRevokeForm() {
  const { isOwner, approve, revoke, isPending, receipt } = useWhitelist();
  const { projects, isLoading: loadingProjects } = useProjects();
  const { options, isLoading: loadingMetadata } = useProjectOptions(projects);

  const [project, setProject] = useState('');
  const [investor, setInvestor] = useState('');

  const canCheck = isHexAddress(project) && isHexAddress(investor);

  const { data: approved, refetch, isFetching } = useReadContract({
    address: WHITELIST_ADDRESS,
    abi: whitelistAbi,
    functionName: 'isApproved',
    args: canCheck ? [project as `0x${string}`, investor as `0x${string}`] : undefined,
    query: { enabled: canCheck },
  });

  const sendApprove = () => {
    if (!isOwner) return alert('Owner only');
    if (!canCheck) return alert('Invalid addresses');
    approve(project as `0x${string}`, investor as `0x${string}`);
  };

  const sendRevoke = () => {
    if (!isOwner) return alert('Owner only');
    if (!canCheck) return alert('Invalid addresses');
    revoke(project as `0x${string}`, investor as `0x${string}`);
  };

  // refresh after confirmation
  if (receipt.isSuccess && canCheck) refetch();

  return (
    <div className="stack">
      <div className="stack">
        <div className="label">Project</div>
        {loadingProjects || loadingMetadata ? (
          <div className="badge">Loading projects…</div>
        ) : (
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="select"
          >
            <option value="">Select project</option>
            {options.map((o) => (
              <option key={o.address} value={o.address}>{o.label}</option>
            ))}
          </select>
        )}
      </div>
  
      <div className="stack">
        <div className="label">Investor Address</div>
        <input
          value={investor}
          onChange={(e) => setInvestor(e.target.value.trim())}
          placeholder="0x…"
          className="input"
        />
      </div>
  
      <div className="row">
        <button onClick={() => refetch()} disabled={!canCheck || isFetching} className="btn">
          {isFetching ? 'Checking…' : 'Check'}
        </button>
        <button onClick={sendApprove} disabled={!isOwner || isPending} className="btn btn-primary">
          {isPending ? 'Sending…' : 'Approve'}
        </button>
        <button onClick={sendRevoke} disabled={!isOwner || isPending} className="btn btn-danger">
          {isPending ? 'Sending…' : 'Revoke'}
        </button>
      </div>
  
      <div>
        <span className="label">Status</span>{' '}
        {canCheck ? (approved ? <span className="badge">Approved</span> : <span className="badge">Not approved</span>) : <span className="badge">Enter details</span>}
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <label>
  //       <div>Project</div>
  //       {loadingProjects || loadingMetadata ? (
  //         <p>Loading projects…</p>
  //       ) : (
  //         <select
  //           value={project}
  //           onChange={(e) => setProject(e.target.value)}
  //           style={{ width: '100%' }}
  //         >
  //           <option value="">Select project</option>
  //           {options.map((o) => (
  //             <option key={o.address} value={o.address}>
  //               {o.label}
  //             </option>
  //           ))}
  //         </select>
  //       )}
  //     </label>

  //     <label>
  //       <div>Investor Address</div>
  //       <input
  //         value={investor}
  //         onChange={(e) => setInvestor(e.target.value.trim())}
  //         placeholder="0xInvestor..."
  //         style={{ width: '100%' }}
  //       />
  //     </label>

  //     <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
  //       <button onClick={() => refetch()} disabled={!canCheck || isFetching}>
  //         {isFetching ? 'Checking…' : 'Check'}
  //       </button>
  //       <button onClick={sendApprove} disabled={!isOwner || isPending}>
  //         {isPending ? 'Sending…' : 'Approve'}
  //       </button>
  //       <button onClick={sendRevoke} disabled={!isOwner || isPending}>
  //         {isPending ? 'Sending…' : 'Revoke'}
  //       </button>
  //     </div>

  //     <div style={{ marginTop: 8 }}>
  //       <strong>Status:</strong>{' '}
  //       {canCheck ? (approved ? 'Approved' : 'Not approved') : 'Select a project and enter an address'}
  //     </div>
  //   </div>
  // );
}
