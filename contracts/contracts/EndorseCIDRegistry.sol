// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

// Records the public endorse of CID files

contract EndorseCIDRegistry {

    /// uint256
    uint256 public MAX_SIGN_VALIDITY = 60*60*24*7;  // 7 days for max sign validity

    /// mapping
    /// @dev mapping CID to address => bool map. Given a CID, check if an endorser is supporting it.
    ///         CIDs are hashed for gas efficiency
    mapping (bytes32 => mapping(address => bool)) private _endorseCIDmap;
    /// @dev how many endorser a CID has
    mapping (bytes32 => uint256) private _numOfEndorser;

    /// events
    /**
    * Event emitted every time a CID is endorsed
    * @param _from      The address that endorse the CID
    * @param _CID       The CID endorsed
    * @param _withSign  true if it has been made via sign, false otherwise
    **/
    event Endorsed(address indexed _from, string _CID, bool _withSign);
    /**
    * Event emitted every time a CID is opposed (no more endorsed)
    * @param _from      The address that oppose the CID
    * @param _CID       The CID opposed
    * @param _withSign  true if it has been made via sign, false otherwise
    **/
    event Opposed(address indexed _from, string _CID, bool _withSign);

    /**
    * @notice endorse a list of CIDs
    * @dev To endorse on behalf of another user, use the `endorseCIDWithSign` method
    * @param _CID list of CIDs to endorse
    **/
    function endorseCID(
        string[] calldata _CID
    ) public {
        for ( uint i = 0; i < _CID.length; ++i) {
            _setEndorseState(_CID[i], msg.sender, true);
            emit Endorsed(msg.sender, _CID[i], false);
        }
    }

    /**
    * @notice endorse CIDs on behalf of another user
    * @dev The hash to sign is defined in the _verifySigner function
    * @param _CID           list of CIDs to endorse
    * @param _from          address that endorse the CIDs
    * @param _validAfter    min timestamp of validity
    * @param _validBefore   max timestamp of validity
    * @param _v             v of the signature
    * @param _r             r of the signature
    * @param _s             s of the signature
    **/
    function endorseCIDWithSign(
        string[] calldata _CID,
        address _from,
        uint256 _validAfter,
        uint256 _validBefore,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        require( block.timestamp > _validAfter, "Not yet in the validity timeframe");
        require( block.timestamp < _validBefore, "Validity expired");
        require( _verifySigner(_CID, _from, _validAfter, _validBefore, _v, _r, _s), "Invalid Sign" );

        for ( uint i = 0; i < _CID.length; ++i) {
            _setEndorseState(_CID[i], _from, true);
            emit Endorsed(_from, _CID[i], true);
        }
    }

    /**
    * @notice remove the endorse for one or mode CIDs
    * @dev To remove the endorse on behalf of another user, use the `opposeCIDWithSign` method
    * @param _CID list of CIDs to oppose
    **/
    function opposeCID(
        string[] calldata _CID
    ) public {
        for ( uint i = 0; i < _CID.length; ++i) {
            _setEndorseState(_CID[i], msg.sender, false);
            emit Opposed(msg.sender, _CID[i], false);
        }
    }

    /**
    * @notice oppose CIDs on behalf of another user
    * @dev The hash to sign is defined in the _verifySigner function
    * @param _CID           list of CIDs to oppose
    * @param _from          address that oppose the CIDs
    * @param _validAfter    min timestamp of validity
    * @param _validBefore   max timestamp of validity
    * @param _v             v of the signature
    * @param _r             r of the signature
    * @param _s             s of the signature
    **/
    function opposeCIDWithSign(
        string[] calldata _CID,
        address _from,
        uint256 _validAfter,
        uint256 _validBefore,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        require( block.timestamp > _validAfter, "Not yet in the validity timeframe");
        require( block.timestamp < _validBefore, "Validity expired");
        require( _verifySigner(_CID, _from, _validAfter, _validBefore, _v, _r, _s), "Invalid Sign" );

        for ( uint i = 0; i < _CID.length; ++i) {
            _setEndorseState(_CID[i], _from, false);
            emit Opposed(_from, _CID[i], true);
        }
    }

    /**
    * @notice get if a file is endorsed by a specific address
    * @param _CID           the CID to query
    * @param _endorser      address of the endorser to check
    * @return isEndorsed    true if the _CID is endorsed by _endorser, false otherwise
    **/
    function endorseStatus (string calldata _CID, address _endorser) public view returns(bool isEndorsed) {
        return _endorseCIDmap[keccak256(abi.encode(_CID))][_endorser];
    }

    /**
    * @notice get the amount of addresses that are endorsing a file
    * @param _CID               the CID to query
    * @return numberOfEndorser  number of addresses that endorsed this CID
    **/
    function numberOfEndorser (string calldata _CID) public view returns(uint numberOfEndorser) {
        return _numOfEndorser[keccak256(abi.encode(_CID))];
    }

    //    ██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
    //    ██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
    //    ██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗      █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
    //    ██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝      ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
    //    ██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗    ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
    //    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝

    /**
    * @notice verify a sign
    * @dev Hash to sign is keccak256( abi.encode( _CID, _from, _validAfter, _validBefore ) )
    * @param _CID           list of CIDs to endorse
    * @param _from          address that endorse the CIDs
    * @param _validAfter    min timestamp of validity
    * @param _validBefore   max timestamp of validity
    * @param _v             v of the signature
    * @param _r             r of the signature
    * @param _s             s of the signature
    * @return isVerified   true if sign is verified, false otherwise
    **/
    function _verifySigner (
        string[] calldata _CID,
        address _from,
        uint256 _validAfter,
        uint256 _validBefore,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) private view returns (bool isVerified) {
        require((_validBefore - _validAfter) <= MAX_SIGN_VALIDITY, "Max sign validity exceeds MAX_SIGN_VALIDITY");
        bytes memory data = abi.encode(
            _CID, _from, _validAfter, _validBefore
        );
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(data)));
        address signer = ecrecover(messageHash, _v, _r, _s);
        return _from == signer;
    }

    /**
    * @notice Set the endorse status for a given CID and Address
    * @param _CID           CID to endorse / oppose
    * @param _addr          who is endorsing / opposing
    * @param _endorse       true to endorse, false to oppose
    **/
    function _setEndorseState (
        string calldata _CID,
        address _addr,
        bool _endorse
    ) private {
        // evaluate the CIDs hash for better gas cost
        bytes32 CIDhash = keccak256(abi.encode(_CID));
        // update the number of endorser, if there's a change in the endorse status
        if (_endorseCIDmap[CIDhash][_addr] != _endorse) {
            if (_endorse) _numOfEndorser[CIDhash] += 1;
            else _numOfEndorser[CIDhash] -= 1;
        }
        // record the endorse status
        _endorseCIDmap[CIDhash][_addr] = _endorse;
    }

}
