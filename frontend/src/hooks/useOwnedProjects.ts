import { useMemo } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { FACTORY_ADDRESS } from '../lib/addresses';
import { factoryAbi } from '../lib/abis/factory';
import { realEstateTokenAbi } from '../lib/abis/realEstateToken';

type Addr = `0x${string}`;

export function useOwnedProjects() {
  const { address } = useAccount();

  // 1) Get all deployed projects
  const { data: all, isLoading: loadingList, error: listError } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: 'getAllProjects',
  });

  const projects = (all as Addr[]) || [];

  // 2) For each, read owner()
  const { data: ownerResults, isLoading: loadingOwners } = useReadContracts({
    allowFailure: true,
    contracts: projects.map((p) => ({
      address: p,
      abi: realEstateTokenAbi,
      functionName: 'owner' as const,
    })),
    query: { enabled: projects.length > 0 },
  });

  // 3) Filter to owned by connected address
  const owned = useMemo<Addr[]>(() => {
    if (!address || !ownerResults) return [];
    const out: Addr[] = [];
    projects.forEach((p, i) => {
      const r = ownerResults[i];
      if (r && !('error' in r) && (r.result as string)?.toLowerCase() === address.toLowerCase()) {
        out.push(p);
      }
    });
    return out;
  }, [address, ownerResults, projects]);

  return {
    projectsOwned: owned,
    isLoading: loadingList || loadingOwners,
    error: listError,
  };
}
