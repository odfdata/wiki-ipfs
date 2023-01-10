pragma solidity ^0.8.17;

contract EndorseCIDList {


    /// mapping
    /// @dev mapping CID to address => bool map. Given a CID, check if an endorser is supporting it.
    ///         CIDs are hashed for gas efficiency
    mapping (bytes32 => mapping(address => bool)) private _endorseCIDmap;

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
        string[] memory _CID
    ) public {
        for ( uint i = 0; i < _CID.length; ++i) {
            _setEndorseState(_CID[i], msg.sender, true);
            emit Endorsed(_CID[i], msg.sender, false);
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
        string[] memory _CID,
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
            emit Endorsed(_CID[i], _from, true);
        }
    }

    /**
    * @notice remove the endorse for one or mode CIDs
    * @dev To remove the endorse on behalf of another user, use the `opposeCIDWithSign` method
    * @param _CID list of CIDs to oppose
    **/
    function opposeCID(
        string[] memory _CID
    ) public {
        for ( uint i = 0; i < _CID.length; ++i) {
            _setEndorseState(_CID[i], msg.sender, false);
            emit Opposed(_CID[i], msg.sender, false);
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
        string[] memory _CID,
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
            emit Opposed(_CID[i], _from, true);
        }
    }

    /**
    * @notice get if a file is endorsed by a specific address
    * @param _CID           the CID to query
    * @param _endorser      address of the endorser to check
    * @return true if the _CID is endorsed by _endorser, false otherwise
    **/
    function endorseStatus (string memory _CID, address _endorser) public view returns(bool) {
        return _endorseCIDmap[keccak256(_CID)][_endorser];
    }

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
    **/
    function _verifySigner (
        string[] memory _CID,
        address _from,
        uint256 _validAfter,
        uint256 _validBefore,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) private returns (bool) {
        bytes memory data = abi.encode(
            _CID, _from, _validAfter, _validBefore
        );
        bytes32 message = keccak256(data);
        address signer = ecrecover(message, v, r, s);
        return msg.sender == signer;
    }

    /**
    * @notice Set the endorse status for a given CID and Address
    * @param _CID           CID to endorse / oppose
    * @param _addr          who is endorsing / opposing
    * @param _endorse       true to endorse, false to oppose
    **/
    function _setEndorseState (
        string memory _CID,
        address _addr,
        bool _endorse
    ) private {
        // evaluate the CIDs hash for better gas cost
        bytes32 CIDhash = keccak256(_CID);
        _endorseCIDmap[CIDhash][_addr] = _endorse;
    }




}
