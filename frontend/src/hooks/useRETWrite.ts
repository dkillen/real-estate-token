import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { realEstateTokenAbi } from '../lib/abis/realEstateToken';

type Addr = `0x${string}`;

export function useRETWrite(token?: Addr) {
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: confirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  const mint = (to: Addr, amount: bigint) =>
    writeContract({ address: token!, abi: realEstateTokenAbi, functionName: 'mint', args: [to, amount] });

  const adminBurn = (from: Addr, amount: bigint) =>
    writeContract({ address: token!, abi: realEstateTokenAbi, functionName: 'adminBurn', args: [from, amount] });

  return { mint, adminBurn, txHash: hash, confirming, isPending, isSuccess, receipt, writeError };
}
