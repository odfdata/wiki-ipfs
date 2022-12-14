import {useBaseAsyncHook, useBaseAsyncHookState} from "../utils/useBaseAsyncHook";
import axios from "axios";
import {IPFS_GATEWAY_BASE_URL} from "../../utils/constants";
import {useEffect} from "react";

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
 * @param {DirectoryFile[]} directoryFileList - can be empty if querying for a specific file
 */
export interface SearchCIDResult {
  isDirectory: boolean,
  isFile: boolean,
  directoryFileList: DirectoryFile[]
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
        const ipfsResult = await axios.get(`${IPFS_GATEWAY_BASE_URL}?arg=${CID}`);
        if (ipfsResult.status !== 200) throw new Error(`CID ${CID} doesn't exist`);
        const ipfsResultJson = ipfsResult.data;
        endAsyncActionSuccess({
          isDirectory: ipfsResultJson.Objects[0].Links.length > 0,
          isFile: ipfsResultJson.Objects[0].Links.length === 0,
          directoryFileList: ipfsResultJson.Objects[0].Links.map(link => {
            return { name: link.Name, CID: link.Hash, size: link.Size }
          })});
      } catch (e) {
        endAsyncActionError(e.message());
      }
    }).then(() => {});
  }, []);

  return { completed, error, loading, result, progress };

};
