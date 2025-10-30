import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { realEstateTokenAbi } from '../lib/abis/realEstateToken';

type Addr = `0x${string}`;
type Option = { address: Addr; label: string };

export function useProjectOptions(addresses: Addr[]) {
  // Build a flat list of contract calls: 3 per address
  const contracts = useMemo(() => {
    return addresses.flatMap((address) => ([
      { address, abi: realEstateTokenAbi, functionName: 'name' as const },
      { address, abi: realEstateTokenAbi, functionName: 'symbol' as const },
      { address, abi: realEstateTokenAbi, functionName: 'propertyId' as const },
    ]));
  }, [addresses]);

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    allowFailure: true, // if any token is misconfigured, we still render others
  });

  const options: Option[] = useMemo(() => {
    if (!data || addresses.length === 0) return [];

    // data comes back in the same order: [name1, symbol1, propertyId1, name2, symbol2, ...]
    const opts: Option[] = [];
    for (let i = 0; i < addresses.length; i++) {
      const nameRes = data[i * 3 + 0];
      const symbolRes = data[i * 3 + 1];
      const propRes = data[i * 3 + 2];

      const name = (nameRes && !nameRes.error ? (nameRes.result as string) : '');
      const symbol = (symbolRes && !symbolRes.error ? (symbolRes.result as string) : '');
      const propertyId = (propRes && !propRes.error ? (propRes.result as string) : '');

      const labelParts = [
        name || 'Unknown',
        symbol ? `(${symbol})` : '',
        propertyId ? `– ${propertyId}` : '',
      ].filter(Boolean);

      opts.push({
        address: addresses[i],
        label: labelParts.join(' '),
      });
    }
    return opts;
  }, [data, addresses]);

  return { options, isLoading, refetch };
}
