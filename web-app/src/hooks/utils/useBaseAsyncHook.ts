import {useState} from "react";

/**
 * @param {boolean} completed - true if the async action completed, false otherwise
 * @param {boolean} loading - true if async action is in progress, false otherwise
 * @param {string} error - string containing the error emitted by the async operation
 * @param {T | undefined} result - the result of the async call
 */
export interface useBaseAsyncHookState<T> {
  completed: boolean,
  loading: boolean,
  error: string,
  result: T | undefined
}

/**
 * @param {() => void} startAsyncAction - starts the async action
 * @param {(_result: T) => void} endAsyncActionSuccess - ends the async action with success
 * @param {(_error: string) => void} endAsyncActionError - ends the async action with error, setting the error
 * @param {(_result: T) => void} updateAsyncActionProgress - update the async action progress
 */
export interface useBaseAsyncHookReturn<T> extends useBaseAsyncHookState<T> {
  startAsyncAction: () => void,
  endAsyncActionSuccess: (_result: T) => void,
  endAsyncActionError: (_error: string) => void,
  updateAsyncActionProgress: (_result: T) => void
}

/**
 * Manages the states of an async hook. Used to handle API calls / SC itneractions and any other thing that
 * expects an async action with the eyes of .tsx component.
 *
 * Set the type of hook
 */
export const useBaseAsyncHook = <T>(): useBaseAsyncHookReturn<T> => {
  const [status, setStatus] = useState<useBaseAsyncHookState<T>>({completed: false, error: "", loading: false, result: undefined});

  /**
   * Starts an async action
   */
  const startAsyncAction = () => {
    setStatus({
      loading: true,
      error: "",
      completed: false,
      result: undefined
    })
  }

  /**
   * Ends an async action with success
   * @param {T} _result - the response to return
   */
  const endAsyncActionSuccess = (_result: T) => {
    setStatus({
      loading: false,
      error: "",
      completed: true,
      result: _result
    })
  }

  /**
   * Ends an async action with error
   * @param {string} _error - the error to set
   */
  const endAsyncActionError = (_error: string) => {
    setStatus({
      loading: false,
      error: _error,
      completed: true,
      result: undefined
    })
  }

  /**
   * Update the async action progress (like during an upload)
   * @param {T} _result - the result to be stored in the state
   */
  const updateAsyncActionProgress = (_result: T) => {
    setStatus({
      loading: true,
      error: "",
      completed: false,
      result: _result
    });
  }

  return {
    ...status,
    startAsyncAction,
    endAsyncActionSuccess,
    endAsyncActionError,
    updateAsyncActionProgress
  }

}
