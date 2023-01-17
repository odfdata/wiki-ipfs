import axios from "axios";
import {IPFS_GATEWAY_BASE_URL} from "../constants";

/**
 * Checks if a given CID is a file (returning true) or a folder (returning false)
 * @param {string} cid - the CID to analyze
 * @return {Promise<boolean>} - true if it's a file, false otherwise
 */
export const isCIDaFile = async (cid: string): Promise<boolean> => {
  const ipfsResult = await axios.get(`${IPFS_GATEWAY_BASE_URL}/api/v0/ls?arg=${cid}`);
  if (ipfsResult.status !== 200) throw new Error(`CID ${cid} doesn't exist`);
  const ipfsResultJson = ipfsResult.data;
  // case of just one file
  if (ipfsResultJson.Objects[0].Links.length === 0) return true;
  // case of one folder inside
  else if (
    ipfsResultJson.Objects[0].Links.length === 1 && ipfsResultJson.Objects[0].Links[0].Type === 1
  ) return false;
  // case of a file
  else if (
    ipfsResultJson.Objects[0].Links.length === 1 && ipfsResultJson.Objects[0].Links[0].Type === 2
  ) return true;
  // check if we have more files. If there's a name (this is a folder), otherwise it's a single file
  for (let i of ipfsResultJson.Objects[0].Links) {
    if (i.Name !== "") return false;
  }
  return true;
}
