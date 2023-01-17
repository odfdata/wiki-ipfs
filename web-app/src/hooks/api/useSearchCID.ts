import {useBaseAsyncHook, useBaseAsyncHookState} from "../utils/useBaseAsyncHook";
import axios from "axios";
import {IPFS_GATEWAY_BASE_URL} from "../../utils/constants";
import {useEffect} from "react";
import {isCIDaFile} from "../../utils/IPFS/utils";

/**
 * @param {string} name
 * @param {number} size
 * @param {string} CID
 */
export interface DirectoryFile {
  name: string,
  size: number,
  CID: string
}

/**
 * @param {boolean} isDirectory
 * @param {boolean} isFile
 */
export interface SearchCIDResult {
  isDirectory: boolean,
  isFile: boolean
}


/**
 * Hook to search CID using IPFS gateway
 */
export const useSearchCID = (CID: string): useBaseAsyncHookState<SearchCIDResult> => {
  const { completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess, endAsyncActionError } = useBaseAsyncHook<SearchCIDResult>();

  useEffect(() => {
    startAsyncAction();
    new Promise (async (resolve, reject) => {
      try {
        let isFile = await isCIDaFile(CID);
        endAsyncActionSuccess({
          isDirectory: !isFile,
          isFile: isFile
        });
      } catch (e) {
        endAsyncActionError(e.message());
      }
    }).then(() => {});
  }, []);

  return { completed, error, loading, result, progress };

};
