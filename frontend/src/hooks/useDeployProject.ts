import { useCallback } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { decodeEventLog } from 'viem';
import { FACTORY_ADDRESS } from '../lib/addresses';
import { factoryAbi } from '../lib/abis/factory';

export function useDeployProject() {
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { data: receipt, isLoading: confirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const deploy = useCallback((args: {
    name: string; symbol: string;
    propertyId: string; jurisdiction: string; metadataUri: string;
  }) => {
    writeContract({
      address: FACTORY_ADDRESS,
      abi: factoryAbi,
      functionName: 'deployProject',
      args: [
        args.name,
        args.symbol,
        args.propertyId,
        args.jurisdiction,
        args.metadataUri,
      ],
    });
  }, [writeContract]);

  // extract new project address if available
  let newProject: `0x${string}` | undefined;
  if (isSuccess && receipt?.logs?.length) {
    for (const log of receipt.logs) {
      try {
        const parsed = decodeEventLog({
          abi: factoryAbi,
          data: log.data,
          topics: log.topics,
        });
        if (parsed.eventName === 'ProjectCreated') {
          newProject = parsed.args.projectAddress as `0x${string}`;
          break;
        }
      } catch {}
    }
  }

  return {
    deploy,
    txHash: hash,
    newProject,
    isPending,
    confirming,
    isSuccess,
    writeError,
  };
}
