import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";

export interface UseGetEndorseStatusParams {
  chainId: number,
  CID: string,
  endorser: string
}

export const useGetEndorseStatus = (params: UseGetEndorseStatusParams): useBaseAsyncHookState<boolean> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<number>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.ENDORSE_CID_REGISTRY_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.ENDORSE_CID_REGISTRY_ABI,
    functionName: "endorseStatus",
    args: [params.CID, params.endorser]
  });

  const readResult = contractRead.data as unknown as boolean;

  return { completed: contractRead.isSuccess, error, loading: contractRead.isFetching, progress, result: readResult };
};
