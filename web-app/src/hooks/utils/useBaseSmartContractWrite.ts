import {useState} from "react";
import {useBaseAsyncHook, useBaseAsyncHookReturn, useBaseAsyncHookState} from "./useBaseAsyncHook";

/**
 * @param {string} txHash - hash of the tx, empty if not set
 */
export interface useBaseSmartContractWriteState<T> extends useBaseAsyncHookState<T> {
  txHash: string
}

/**
 * @param {(_txHash: string) => void} startAsyncActionWithTxHash - starts the async action setting the tx hash
 */
export interface useBaseSmartContractWriteReturn<T> extends useBaseSmartContractWriteState<T>, useBaseAsyncHookReturn<T> {
  startAsyncActionWithTxHash: (_txHash: string) => void
}

/**
 * This is the return that any smart contract writer should implement
 * @param {() => void | undefined} write - once called, starts the call
 */
export interface useBaseSmartContractWriteExternalReturn<T> extends useBaseSmartContractWriteState<T> {
  write: () => void | undefined
}

/**
 * Extension of useBaseAsyncHook, studied to implement write actions on the blockchain (with tx hash)
 */
export const useBaseSmartContractWrite = <T>(): useBaseSmartContractWriteReturn<T> => {
  const [txHash, setTxHash] = useState<string>("");
  const baseAsyncHookState = useBaseAsyncHook<T>();

  /**
   * Starts an async action
   */
  const startAsyncActionWithTxHash = (_txHash: string) => {
    baseAsyncHookState.startAsyncAction();
    setTxHash(_txHash);
  }

  /**
   * Ends an async tx action with success
   * @param {T} _result - the response to return
   */
  const endAsyncActionSuccess = (_result: T) => {
    setTxHash("");
    baseAsyncHookState.endAsyncActionSuccess(_result);
  }

  /**
   * Ends an async tx action with error
   * @param {string} _error - the error to set
   */
  const endAsyncActionError = (_error: string) => {
    setTxHash("");
    baseAsyncHookState.endAsyncActionError(_error);
  }

  return {
    ...baseAsyncHookState,
    endAsyncActionSuccess,
    endAsyncActionError,
    txHash,
    startAsyncActionWithTxHash
  }

}
