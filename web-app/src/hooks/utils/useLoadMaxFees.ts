import {ethers} from "ethers";
import axios from "axios";
import {BigNumber} from "@ethersproject/bignumber";
import {useBaseAsyncHook, useBaseAsyncHookState} from "./useBaseAsyncHook";

export interface LoadMaxFeesResult {
  maxFeePerGas: BigNumber,
  maxPriorityFeePerGas: BigNumber
}

/**
 * @param {function} loadMaxFees
 */
export interface UseLoadMaxFeesResponse extends useBaseAsyncHookState<LoadMaxFeesResult> {
  loadMaxFees: () => void
}

export const useLoadMaxFees = (): UseLoadMaxFeesResponse => {
  const {completed, error, loading, result,
    startAsyncAction, endAsyncActionSuccess, endAsyncActionError} = useBaseAsyncHook<LoadMaxFeesResult>();

  const loadMaxFees = (): void => {
    startAsyncAction();
    new Promise(async (resolve, reject) => {
      // get max fees from gas station
      let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
      let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
      let error: string = "";
      try {
        const {data} = await axios.get('https://gasstation-mainnet.matic.network/v2');
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        );
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        );
        endAsyncActionSuccess({maxFeePerGas, maxPriorityFeePerGas});
      } catch (e) {
        endAsyncActionError(e.toString());
      }
    }).then(() => {});
  };
  return { completed, error, loading, result, loadMaxFees };
}
