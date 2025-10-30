import { useMemo, useRef } from 'react';
import { useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi';
import { realEstateTokenAbi } from '../lib/abis/realEstateToken';

type Addr = `0x${string}`;

export function useRETDetails(address?: Addr) {
  // metadata + supply (single calls)
  const { data: name } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'name', query: { enabled: !!address } });
  const { data: symbol } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'symbol', query: { enabled: !!address } });
  const { data: propertyId } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'propertyId', query: { enabled: !!address } });
  const { data: jurisdiction } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'jurisdiction', query: { enabled: !!address } });
  const { data: metadataUri } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'metadataUri', query: { enabled: !!address } });
  const { data: totalSupply } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'totalSupply', query: { enabled: !!address } });
  const { data: decimals } = useReadContract({ address, abi: realEstateTokenAbi, functionName: 'decimals', query: { enabled: !!address } });

  // shareholders + refetch handle
  const { data: holders, refetch: refetchShareholders } = useReadContract({
    address,
    abi: realEstateTokenAbi,
    functionName: 'getShareholders',
    query: { enabled: !!address },
  });
  const addresses = (holders as Addr[]) || [];

  // balances (multicall) + refetch handle
  const { data: balanceResults, refetch: refetchBalances } = useReadContracts({
    allowFailure: true,
    contracts: addresses.map((a) => ({
      address: address!, abi: realEstateTokenAbi, functionName: 'balanceOf' as const, args: [a],
    })),
    query: { enabled: !!address && addresses.length > 0 },
  });

  // const balances = useMemo(() => {
  //   if (!balanceResults) return [];
  //   return addresses.map((a, i) => {
  //     const r = balanceResults[i];
  //     const bal = r && !('error' in r) ? (r.result as bigint) : 0n;
  //     return { address: a, balance: bal };
  //   });
  // }, [addresses, balanceResults]);

  const balances = useMemo(() => {
    if (!balanceResults) return [];
  
    // 1) unique addresses (case-insensitive)
    const seen = new Set<string>();
    const uniqueAddrs = addresses.filter((a) => {
      const k = a.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  
    // 2) map balances for unique addresses
    return uniqueAddrs
      .map((a) => {
        const idx = addresses.findIndex((x) => x.toLowerCase() === a.toLowerCase());
        const r = balanceResults[idx];
        const bal = r && !('error' in r) ? (r.result as bigint) : 0n;
        return { address: a, balance: bal };
      })
      // 3) show current holders only
      .filter((row) => row.balance > 0n);
  }, [addresses, balanceResults]);

  const lastSeen = useRef<string | null>(null);
  
  // LIVE update on any Transfer (mint, burn, or transfer)
  useWatchContractEvent({
    address,
    abi: realEstateTokenAbi,
    eventName: 'Transfer',
    onLogs: (logs) => {
      // collapse multiple logs from same tx
      const txHash = logs[0]?.transactionHash;
      if (!txHash || lastSeen.current === txHash) return;
      lastSeen.current = txHash;
  
      refetchShareholders();
      refetchBalances();
    },
  });

  return {
    meta: {
      name: name as string | undefined,
      symbol: symbol as string | undefined,
      propertyId: propertyId as string | undefined,
      jurisdiction: jurisdiction as string | undefined,
      metadataUri: metadataUri as string | undefined,
      totalSupply: (totalSupply as bigint | undefined) ?? 0n,
      decimals: (decimals as number | undefined) ?? 0,
    },
    shareholders: balances,
    refetchShareholders,
    refetchBalances,
  };
}
