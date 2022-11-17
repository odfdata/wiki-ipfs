import {useBaseAsyncHook, useBaseAsyncHookState} from "../utils/useBaseAsyncHook";
import {Web3Storage} from "web3.storage";
import {useEffect} from "react";

/**
 * @param {string} cid - CID of the uploaded file
 */
export interface UploadedFileDetails {
  cid: string
}

/**
 * @param {File} file - the file to be uploaded
 */
export interface UploadFileParams {
  file: File
}


/**
 * Hook used to upload files using web3.storage
 */
export const useUploadFile = (params: UploadFileParams): useBaseAsyncHookState<UploadedFileDetails> => {
  const { completed, error, loading, progress, result,
    startAsyncAction, endAsyncActionSuccess, updateAsyncActionProgress } = useBaseAsyncHook<UploadedFileDetails>();

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
    const client = new Web3Storage({ token: process.env.REACT_APP_WEB3STORAGE_TOKEN as string });

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    client.put([params.file], { onRootCidReady, onStoredChunk }).then((cid) => {
      endAsyncActionSuccess({cid: cid});
    });
  }, [params.file]);

  const uploadPercentage = (percentage: number): void => {
    updateAsyncActionProgress(percentage);
  }

  return { completed, error, loading, progress, result };

}
