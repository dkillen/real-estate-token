import { useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { whitelistAbi } from '../lib/abis/whitelist';
import { WHITELIST_ADDRESS } from '../lib/addresses';

export function useWhitelist() {
  const { address: connected } = useAccount();

  const { data: owner } = useReadContract({
    address: WHITELIST_ADDRESS,
    abi: whitelistAbi,
    functionName: 'owner',
  });

  const isOwner = useMemo(
    () => !!connected && !!owner && connected.toLowerCase() === (owner as string).toLowerCase(),
    [connected, owner]
  );

  const { writeContract, data: hash, isPending } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const approve = (project: `0x${string}`, investor: `0x${string}`) =>
    writeContract({ address: WHITELIST_ADDRESS, abi: whitelistAbi, functionName: 'approve', args: [project, investor] });

  const revoke = (project: `0x${string}`, investor: `0x${string}`) =>
    writeContract({ address: WHITELIST_ADDRESS, abi: whitelistAbi, functionName: 'revoke', args: [project, investor] });

  return { owner, isOwner, hash, isPending, receipt, approve, revoke };
}
