import {useBaseAsyncHook} from "../../utils/useBaseAsyncHook";
import {useContractRead, useNetwork} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";
import {useBaseSmartContractReadReturn} from "../../utils/useBaseSmartContractRead";

export interface UseGetEndorseStatusParams {
  CID: string,
  endorser: string
}

export const useGetEndorseStatus = (params: UseGetEndorseStatusParams): useBaseSmartContractReadReturn<boolean> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<number>();
  const network = useNetwork();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[network.chain?.id]?.ENDORSE_CID_REGISTRY_ADDRESS,
    abi: CONTRACTS_DETAILS[network.chain?.id]?.ENDORSE_CID_REGISTRY_ABI,
    functionName: "endorseStatus",
    args: [params.CID, params.endorser]
  });

  const readResult = contractRead.data as unknown as boolean;

  const refetch = () => {
    contractRead.refetch().then((result) => { })
  }

  return {
    completed: contractRead.isSuccess,
    error,
    loading: contractRead.isFetching,
    progress,
    result: readResult,
    refetch
  };
};
