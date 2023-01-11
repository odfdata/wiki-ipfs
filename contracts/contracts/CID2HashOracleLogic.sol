// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import './CID2HashRegistry.sol';

// Smart contract in charge of connecting with CL Oracle, and store CID 2 Hash results
// inside CID2HashRegistry

contract CID2HashOracleLogic is ChainlinkClient, ConfirmedOwner {

    using Chainlink for Chainlink.Request;

    //// uint256
    /// @dev the payment to be sent in ORACLE_PAYMENT_TOKEN_ADDRESS tokens to the Oracle
    uint256 public ORACLE_PAYMENT = 0;
    /// @dev max number of CID a user can send along with one single request
    uint256 public MAX_CID_PER_VERIFICATION = 10;

    /// address
    address public ORACLE_PAYMENT_TOKEN_ADDRESS;

    /// bytes32
    /// @dev stores the ID of the ChainLink job
    bytes32 private jobId;

    /// mapping
    /// @dev recording the status of the CID verification: 1: pending - 2: success - 3-10,000: error
    mapping (bytes32 => uint) private pendingCID;

    /// instances
    CID2HashRegistry public Cid2HashRegistryContract;

    /// events
    /**
    * Event emitted when a new request of Cid 2 Hash is published
    * @param _cidList       The list of CID requested for hash generation
    **/
    event CID2HashRequest(string[] _cidList);
    /**
    * Event emitted when a success generation of CID and hash is received
    * @param _cid       The CID returned
    * @param _hash      The hash evaluated by the oracle
    **/
    event CID2HashSuccessResponse(string indexed _cid, bytes32 indexed _hash);
    /**
    * Event emitted when an error during the generation of hash happens
    * @param _cid       The CID returned
    * @param _error     The code of the error (from 3 to 10,000 - see docs for details)
    **/
    event CID2HashErrorResponse(string indexed _cid, uint256 _error);

    /**
      * @param _jobId       id of the job for ChainLink
      * @param _oracle      address of the Oracle SC
      * @param _payToken    address of the ERC20 token used to pay the Oracle (ideally LINK)
      */
    constructor(
        string memory _jobId,
        address _oracle,
        address _payToken
    ) ConfirmedOwner(msg.sender) {
        ORACLE_PAYMENT_TOKEN_ADDRESS = _payToken;
        setChainlinkToken(_payToken);
        setChainlinkOracle(_oracle);
        jobId = _stringToBytes32(_jobId);
    }

    /**
      * Returns the status of the verification for a given _cid
      * @param _cid         CID to search
      * @return status      verification: 1 for pending - 2 for success - 3+ for errors
      */
    function getVerificationStatus(
        string calldata _cid
    ) public view returns(uint status) {
        bytes32 cidHash = keccak256(abi.encode(_cid));
        return pendingCID[cidHash];
    }

    /**
      * @notice Prepares the call for Chainlink Oracle, sending the CID list to verify
      * @param _cidList     list of CID to get the hash (max 10)
      */
    function requestCID2Hash (
        string[] calldata _cidList
    ) external {
        require(_cidList.length > 0, "Empty array");
        require(_cidList.length <= MAX_CID_PER_VERIFICATION, "MAX_CID_PER_VERIFICATION exceeded");

        for(uint i=0; i<_cidList.length; ++i) {
            bytes32 cidHash = keccak256(abi.encode(_cidList[i]));
            pendingCID[cidHash] = 1;
        }
        // perform a request
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillRequestCIDToHash.selector
        );
        req.addStringArray('cid', _cidList);
        sendOperatorRequest(req, ORACLE_PAYMENT);
        emit CID2HashRequest(_cidList);
    }

    /**
      * @notice Callback from CL Node to fulfill the request
      * @dev An hash with a value < 10,000 means an error. See the docs to get the error code based on the response
      * @param _requestId       id of the request
      * @param _cidList         list of CIDs
      * @param _hashList        list of sha256
      */
    function fulfillRequestCIDToHash(
        bytes32 _requestId,
        string[] calldata _cidList,
        bytes32[] calldata _hashList
    )
    external
    recordChainlinkFulfillment(_requestId) {
        require(_cidList.length == _hashList.length, "Response has different size");

        for (uint i=0; i<_cidList.length; ++i) {
            if (_hashList[i] != bytes32(0)) {
                // record the success of the operation, or the error
                uint returnedHashAsUint = uint(_hashList[i]);
                bytes32 cidHash = keccak256(abi.encode(_cidList[i]));
                if (returnedHashAsUint > 10000) {
                    pendingCID[cidHash] = uint(2);
                    Cid2HashRegistryContract.addHash(_cidList[i], _hashList[i]);
                    emit CID2HashSuccessResponse(_cidList[i], _hashList[i]);
                } else {
                    pendingCID[cidHash] = returnedHashAsUint;
                    emit CID2HashErrorResponse(_cidList[i], returnedHashAsUint);
                }
            }
        }
    }

    /**
      * @notice Get the ChainLink token address
      * @return oraclePaymentTokenAddress       The address of LINK ERC-20
      */
    function getChainlinkToken() public view returns (address oraclePaymentTokenAddress) {
        return ORACLE_PAYMENT_TOKEN_ADDRESS;
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
      * @param _requestId               id of request
      * @param _payment                 payment made
      * @param _callbackFunctionId      id of function to callback
      * @param _expiration              until timestamp
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
      * @param _jobId       updated jobID
      */
    function setJobId (
        string calldata _jobId
    ) external onlyOwner {
        jobId = _stringToBytes32(_jobId);
    }

    /**
      * @notice Sets the new payment to the oracle (in ORACLE_PAYMENT_TOKEN_ADDRESS)
      * @param _newLinkPayment      Amount to be paid to the Oracle
    **/
    function setOraclePayment (
        uint _newLinkPayment
    ) external onlyOwner {
        ORACLE_PAYMENT = _newLinkPayment;
    }

    /**
      * @notice Sets the new payment token address (ideally LNK)
      * @param _newPaymentToken     ERC20 addres of the payment token
    **/
    function setOraclePaymentTokenAddress (
        address _newPaymentToken
    ) external onlyOwner {
        ORACLE_PAYMENT_TOKEN_ADDRESS = _newPaymentToken;
        setChainlinkToken(_newPaymentToken);
    }

    /**
      * @notice Sets the address of Cid2Hash Registry
      * @param _newAddress     ERC20 addres of the payment token
    **/
    function setCid2HashRegistryAddress (
        address _newAddress
    ) external onlyOwner {
        Cid2HashRegistryContract = CID2HashRegistry(_newAddress);
    }

    //    ██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
    //    ██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝    ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
    //    ██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗      █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
    //    ██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝      ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
    //    ██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗    ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
    //    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝

    /**
      * @notice Converts a string into bytes32
      * @param _source      convert the jobID
      * @return result      the converted string
      */
    function _stringToBytes32(
        string memory _source
    ) private pure returns (bytes32 result) {
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
