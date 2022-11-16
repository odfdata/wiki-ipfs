pragma solidity ^0.8.17;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

// Smart contract in charge of matching an IPFS URL with its SHA-256
// and to return IPFS URLs of a given SHA-256 (i.e. find documents on chian)

contract CIDMatcher is ChainlinkClient, ConfirmedOwner{

    using Chainlink for Chainlink.Request;

    //// uint256
    uint256 public ORACLE_PAYMENT = 0 * LINK_DIVISIBILITY / 10;

    /// bytes
    /// @dev jobID of Chainlink
    bytes32 private jobId;

    /// mapping
    /// @dev mapping sha256 to IPFS urls
    mapping (bytes32 => string[]) public sha2ToIPFS;

    /// events
    event NewIPFSHashRequest(string[] _cidList);
    event NewHashRecorded(string indexed _cid, bytes32 indexed _hash);

    /**
      * @param _jobId id of the job for ChainLink
      * @param _oracle address of the Oracle SC
      * @param _LINKAddress Address of the LINK token
      */
    constructor( string memory _jobId, address _oracle, address _LINKAddress) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_LINKAddress);
        setChainlinkOracle(_oracle);
        jobId = _stringToBytes32(_jobId);
    }

    /**
      * @notice Prepares the call for Chainlink Oracle, sending the CID to verify
      * @param _cidList list of CID to get the hash
      */
    function storeHashGivenIpfs (string[] calldata _cidList) external {
        require(_cidList.length > 0, "Empty array");

        // perform a request
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillRequestIpfsToHash.selector
        );
        req.addStringArray('cid', _cidList);
        sendOperatorRequest(req, ORACLE_PAYMENT);
        emit NewIPFSHashRequest(_cidList);
    }

    /**
      * @notice Callback from CL Node to fulfill the request
      * @param _requestId id of the request
      * @param _cidList list of CIDs
      * @param _hashList list of sha256
      */
    function fulfillRequestIpfsToHash(bytes32 _requestId, string[] calldata _cidList, bytes32[] calldata _hashList)
    external
    recordChainlinkFulfillment(_requestId) {
        require(_cidList.length == _hashList.length, "Response has different size");

        for (uint i=0; i<_cidList.length; ++i) {
            if (_hashList[i] != bytes32(0)) {
                sha2ToIPFS[_hashList[i]].push(_cidList[i]);
                emit NewHashRecorded(_cidList[i], _hashList[i]);
            }
        }
    }

    // TODO remove no move available IPFS file (both from IPFStoURL and URLtoIPFS)

    /**
      * @notice Get the ChainLink token address
      * @return The address of LINK ERC-20
      */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    //
    //     ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗
    //    ██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗
    //    ██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██████╔╝
    //    ██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██╔══██╗
    //    ╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗██║  ██║
    //     ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
    //

    /**
      * @notice Move extra LNK to the owner
      */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }

    /**
      * @notice Blocks request to the CL Oracle
      * @param _requestId id of request
      * @param _payment payment made
      * @param _callbackFunctionId id of function to callback
      * @param _expiration until timestamp
      */
    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    /**
      * @notice Updates jobID, if we need to edit it
      * @param _jobId updated jobID
      */
    function setJobId (string calldata _jobId) external onlyOwner {
        jobId = _stringToBytes32(_jobId);
    }

    /**
      * @notice Sets the new payment to the oracle (in LINK)
      * @param _newLinkPayment LINK to be paid to the Oracle
    **/
    function setOraclePayment (uint _newLinkPayment) external onlyOwner {
        ORACLE_PAYMENT = _newLinkPayment;
    }


    //    ██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
    //    ██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
    //    ██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗      █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
    //    ██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝      ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
    //    ██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗    ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
    //    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝

    /**
      * @notice Converts a string into bytes32
      * @param _source convert the jobID
      */
    function _stringToBytes32(string memory _source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
        // solhint-disable-line no-inline-assembly
            result := mload(add(_source, 32))
        }
    }
}
