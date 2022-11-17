import {useBaseAsyncHook, useBaseAsyncHookState} from "../utils/useBaseAsyncHook";
import {Web3Storage} from "web3.storage";
import {useEffect} from "react";

/**
 * @param {number} percentage - Current percentage of the upload
 */
export interface UploadFileStatus {
  percentage: number
}

/**
 * @param {File} file - the file to be uploaded
 */
export interface UploadFileParams {
  file: File
}

/**
 * @param {function} uploadFile
 */
export interface UseUploadFileResponse extends useBaseAsyncHookState<UploadFileStatus> {
  uploadFile: (params: UploadFileParams) => void
}

/**
 * Hook used to upload files using web3.storage
 */
export const useUploadFile = (): UseUploadFileResponse => {
  const { completed, error, loading, result,
    startAsyncAction, endAsyncActionSuccess, updateAsyncActionProgress } = useBaseAsyncHook<UploadFileStatus>();

  const uploadPercentage = (percentage: number): void => {
    updateAsyncActionProgress({percentage});
  }

  const uploadFile = async (params: UploadFileParams) => {
    useEffect(() => {
      startAsyncAction();
      // show the root cid as soon as it's ready
      const onRootCidReady = cid => { console.log('uploading files with cid:', cid); };

      // when each chunk is stored, update the percentage complete and display
      const totalSize = [params.file].map(f => f.size).reduce((a, b) => a + b, 0);
      let uploaded = 0;

      const onStoredChunk = size => {
        uploaded += size;
        const pct = 100 * (uploaded / totalSize);
        console.log(`Uploading... ${pct.toFixed(2)}% complete`);
        uploadPercentage(pct);
      };
      // makeStorageClient returns an authorized web3.storage client instance
      const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN as string });

      // client.put will invoke our callbacks during the upload
      // and return the root cid when the upload completes
      client.put([params.file], { onRootCidReady, onStoredChunk }).then(() => {
        endAsyncActionSuccess({percentage: 100});
      });
    }, [params.file]);
  };
  return { completed, error, loading, result, uploadFile };

}
