import {
  useBaseSmartContractWrite,
  useBaseSmartContractWriteExternalReturn
} from "../../utils/useBaseSmartContractWrite";
import {useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";
import {useEffect} from "react";

export interface UseRequestCid2HashParams {
  CIDList: string[]
}

/**
 * Hook to store the hash of a given IPFS CID
 */
export const useRequestCid2Hash = (params: UseRequestCid2HashParams): useBaseSmartContractWriteExternalReturn<undefined> => {
  const {completed, error, loading, result, txHash, progress, endAsyncActionError, endAsyncActionSuccess, startAsyncAction,
    startAsyncActionWithTxHash} = useBaseSmartContractWrite<undefined>();
  const network = useNetwork();
  const prepareContractWrite = usePrepareContractWrite({
    address: CONTRACTS_DETAILS[network.chain?.id]?.CID_2_HASH_ORACLE_LOGIC_ADDRESS,
    abi: CONTRACTS_DETAILS[network.chain?.id]?.CID_2_HASH_ORACLE_LOGIC_ABI,
    functionName: 'requestCID2Hash',
    args: [
      params.CIDList
    ]
  });
  const contractWrite = useContractWrite(prepareContractWrite.config);
  const waitForTx = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  useEffect(() => {
    if (waitForTx.status === "success") endAsyncActionSuccess(undefined)
    else if (waitForTx.status === "loading") startAsyncActionWithTxHash(contractWrite.data?.hash)
    else if (waitForTx.status === "error") endAsyncActionError(waitForTx.error.message)
  }, [waitForTx.status]);

  const write = (() => {
    startAsyncAction();
    contractWrite.writeAsync()
      .then(() => {})
      .catch(e => endAsyncActionError(e.message));
  });

  return { completed, error, loading, result, progress, txHash, write };
};
