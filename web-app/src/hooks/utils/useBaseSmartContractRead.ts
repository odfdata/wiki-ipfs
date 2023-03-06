import {useBaseAsyncHookState} from "./useBaseAsyncHook";

/**
 * The object returned by a smart contract read hook
 */
export interface useBaseSmartContractReadReturn<T> extends useBaseAsyncHookState<T> {
  refetch: () => void
}
