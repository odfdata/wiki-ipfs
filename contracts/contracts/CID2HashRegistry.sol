// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

// Records the combo for CID and hash for a given file

contract CID2HashRegistry is AccessControlEnumerable {

    /// mapping
    /// @dev mapping sha256 to CIDs
    mapping (bytes32 => string[]) public sha2ToCIDs;
    /// @dev mapping IPFS CID to sha256. Store the hash of the CID to reduce the space
    mapping (bytes32 => bytes32) private CIDtoSha2;

    /// roles
    bytes32 public constant WRITER = keccak256("WRITER_ROLE");

    /// events
    /**
    * Event emitted when a new pair CID-hash is added
    * @param _cid       The CID added
    * @param _hash      The hash added
    **/
    event CID2HashAdded(string indexed _cid, bytes32 indexed _hash);

    /**
    * Sets the default admin role to the deployer
    */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
      * @notice Given an hash, returns the array of CIDs stored
      * @param _hash    the hash to search
      * @return CIDs    an array with all the CIDs mapping to that hash
      */
    function getCIDsFromHash(
        bytes32 _hash
    ) public view returns(string[] memory CIDs) {
        return sha2ToCIDs[_hash];
    }

    /**
      * @notice Given a CID, return the hash stored
      * @param _cid         CID to search
      * @return hash        the hash of that CID, bytes32(0) if not present
      */
    function getHashFromCID(
        string calldata _cid
    ) public view returns(bytes32 hash) {
        bytes32 cidHash = keccak256(abi.encode(_cid));
        return CIDtoSha2[cidHash];
    }

    /**
    * @notice Adds a pair CID-hash in memory
    * @param _cid         CID to add
    * @param _hash        hash to add
    */
    function addHash(
        string calldata _cid,
        bytes32 _hash
    ) external onlyRole(WRITER) {
        bytes32 cidHash = keccak256(abi.encode(_cid));
        bytes32 existingHash = CIDtoSha2[cidHash];

        CIDtoSha2[cidHash] = _hash;
        sha2ToCIDs[_hash].push(_cid);

        // if there was another hash already associated with the given CID, make sure to remove
        // the CID from the list of previous hash by setting that CID to empty string
        if (existingHash != bytes32(0)) {
            bytes32 cidHash = keccak256(bytes(_cid));
            for (uint i=0; i<sha2ToCIDs[existingHash].length; ++i) {

                if(
                    keccak256(bytes(sha2ToCIDs[existingHash][i])) == cidHash
                ) {
                    sha2ToCIDs[existingHash][i] = "";
                    break;
                }
            }
        }

    }

}
