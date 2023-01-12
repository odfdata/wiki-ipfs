import crypto from "crypto";
import bs58 from "bs58";

/**
 * Generates a random string representing a CID (does not exist on the IPFS network)
 */
export const generateRandomCid = () => {
  const randomBytes = crypto.randomBytes(32);
  const hash = crypto.createHash('sha256').update(randomBytes).digest();
  return 'Qm' + bs58.encode(hash);
}


/**
 * Generates a random string representing a sha256 hash
 */
export const generateRandomHash = () => {
  const randomBytes = crypto.randomBytes(32);
  return "0x" + crypto.createHash('sha256').update(randomBytes).digest('hex');
}
