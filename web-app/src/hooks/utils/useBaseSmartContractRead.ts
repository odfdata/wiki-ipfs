import {useBaseAsyncHookReturn, useBaseAsyncHookState} from "./useBaseAsyncHook";
import {useBaseSmartContractWriteState} from "./useBaseSmartContractWrite";

/**
 * The object returned by a smart contract read hook
 */
export interface useBaseSmartContractReadReturn<T> extends useBaseAsyncHookState<T> {
  refetch: () => void
}
