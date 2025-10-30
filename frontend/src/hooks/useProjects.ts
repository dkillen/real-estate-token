import { useChainId, useReadContract } from 'wagmi';
import { factoryAbi } from '../lib/abis/factory';
import { FACTORY_ADDRESS } from '../lib/addresses';

export function useProjects() {
  const chainId = useChainId();

  const { data, isLoading, refetch, error, status } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: 'getAllProjects',
    chainId
  });

  // Optional: log errors to see what’s wrong
  if (status === 'error') {
    // eslint-disable-next-line no-console
    console.error('getAllProjects error:', error);
  }

  const projects = (data as `0x${string}`[]) || [];
  return { projects, isLoading, refetch, error };
}
