import { useAccount } from 'wagmi';
import { WHITELIST_ADDRESS } from '../../lib/addresses';
import { useWhitelist } from '../../hooks/useWhitelist';

export default function ContractInfo() {
  const { address } = useAccount();
  const { owner, isOwner } = useWhitelist();

  return (
    <div>
      <p><strong>Whitelist:</strong> <code>{WHITELIST_ADDRESS}</code></p>
      <p><strong>Owner:</strong> <code>{owner ?? '—'}</code></p>
      <p><strong>You:</strong> <code>{address ?? 'Not connected'}</code></p>
      <p style={{ color: isOwner ? '#008000' : '#b00020' }}>{isOwner ? 'You are the owner' : 'You are not the owner'}</p>
    </div>
  );
}
