import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CHAIN_CONSTANTS} from "../../scripts/ProjectConstants";
import {TEST_CHAIN_ID} from "../_setup/TestConstants";
import {ethers} from "hardhat";
import {CID2HashOracleLogic, CID2HashRegistry, EndorseCIDRegistry, Operator} from "../../typechain-types";
import CID2HashOracleLogicABI from "../../artifacts/contracts/CID2HashOracleLogic.sol/CID2HashOracleLogic.json";
import {deployOperator} from "../../scripts/Deployer/SingleContracts/ChainLinkOracle/Operator";
import {setBalance} from "@nomicfoundation/hardhat-network-helpers";
import {deployContractStructure} from "../../scripts/Deployer/deployContractStructure";
import {generateRandomCid, generateRandomHash} from "../../scripts/utils/CID";
import {BigNumber} from "ethers";


const SAMPLE_IPFS_CID_v0: string = "QmVnWhM2qYr9JkjGLaEVSZnCprRLDW8qns1oYYVXjnb4DA";
const SAMPLE_IPFS_CID_v1: string = "bafybeigrw5qh2bvbrno2nsd7fwctensc662zxen4h6b3bmypdbbvtz36ma";
let ORACLE_ADDRESS: string = "";

describe("Oracle Verification Integration Tests", () => {

  let deployer: SignerWithAddress;
  let user01: SignerWithAddress;
  let user02: SignerWithAddress;
  let user03: SignerWithAddress;
  let fakeOracleOwner: SignerWithAddress;  // used to simulate fulfillment callbacks
  let cid2HashOracleLogic: CID2HashOracleLogic;
  let cid2HashRegistry: CID2HashRegistry;
  let endorseCIDRegistry: EndorseCIDRegistry;
  let oracleOperator: Operator;

  before(async () => {
    const [us0, us1, us2, us3, fo] = await ethers.getSigners();
    deployer = us0;
    user01 = us1;
    user02 = us2;
    user03 = us3;
    fakeOracleOwner = fo;
    oracleOperator = await deployOperator(fakeOracleOwner, CHAIN_CONSTANTS[TEST_CHAIN_ID].PAY_TOKEN_ADDRESS, fakeOracleOwner.address);
    ORACLE_ADDRESS = oracleOperator.address;
    const deployedStack = await deployContractStructure(
      CHAIN_CONSTANTS[TEST_CHAIN_ID].JOD_ID,
      ORACLE_ADDRESS,
      CHAIN_CONSTANTS[TEST_CHAIN_ID].PAY_TOKEN_ADDRESS,
      false
    );
    cid2HashOracleLogic = deployedStack.CID2HashOracleLogic;
    cid2HashRegistry = deployedStack.CID2HashRegistry;
    endorseCIDRegistry = deployedStack.endorseCIDRegistry;
  })

  describe("Verification fulfillment", async () => {

    before(async () => {
      // add fake ETH to the Oracle.sol contract to mock the callback
      await setBalance(oracleOperator.address, ethers.utils.parseEther('10'));
    });

    it("Should correctly fulfill the request", async () => {

      // send a request
      const cid = generateRandomCid();
      const hash = generateRandomHash();
      let tx = await cid2HashOracleLogic.connect(user01).requestCID2Hash([cid]);
      let res = await tx.wait();

      // read the requestId from logs
      let e = res.events?.find(e => e.event === "ChainlinkRequested");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;
      let requestId;
      if (e?.args) {
        let iface = new ethers.utils.Interface(CID2HashOracleLogicABI.abi);
        let eventData = iface.parseLog(e);
        requestId = eventData.args['id'];
      }
      expect(requestId).to.not.be.undefined;
      expect(requestId).to.match(/0x([0-9a-f]{64})/);

      // simulate the call from the Operatos.sol to CID2HashOracleLogic.sol
      const contractSigner = await ethers.getImpersonatedSigner(oracleOperator.address);
      tx = await cid2HashOracleLogic.connect(contractSigner).fulfillRequestCIDToHash(
        requestId,
        [cid],
        [hash]
      )
      res = await tx.wait();

      // check if data has been properly stored
      expect(await cid2HashRegistry.getHashFromCID(cid)).to.be.equals(hash);
      const cidList = await cid2HashRegistry.getCIDsFromHash(hash);
      expect(cidList.length).to.be.equals(1);
      expect(cidList[0]).to.be.equals(cid);

      // check that event of success has been emitted
      e = res.events?.find(e => e.event === "CID2HashSuccessResponse");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;

    });

    it("Should fail if answer has different size", async () => {

      // send a request
      const cid = generateRandomCid();
      const hash = generateRandomHash();
      let tx = await cid2HashOracleLogic.connect(user01).requestCID2Hash([cid]);
      let res = await tx.wait();

      // read the requestId from logs
      let e = res.events?.find(e => e.event === "ChainlinkRequested");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;
      let requestId;
      if (e?.args) {
        let iface = new ethers.utils.Interface(CID2HashOracleLogicABI.abi);
        let eventData = iface.parseLog(e);
        requestId = eventData.args['id'];
      }
      expect(requestId).to.not.be.undefined;
      expect(requestId).to.match(/0x([0-9a-f]{64})/);

      // simulate the call from the Operatos.sol to CID2HashOracleLogic.sol
      // simulate both the scenario with 2 cid and 1 hash, and 1 cid with 2 hashes
      let hasFailed = false;
      const contractSigner = await ethers.getImpersonatedSigner(oracleOperator.address);
      try {
        await cid2HashOracleLogic.connect(contractSigner).fulfillRequestCIDToHash(
          requestId,
          [cid, cid],
          [hash]
        )
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Response has different size/);
        hasFailed = true;
      }
      expect(hasFailed).to.be.true;

      hasFailed = false;
      try {
        await cid2HashOracleLogic.connect(contractSigner).fulfillRequestCIDToHash(
          requestId,
          [cid],
          [hash, hash]
        )
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Response has different size/);
        hasFailed = true;
      }
      expect(hasFailed).to.be.true;
    });

    it("Should correctly record a possible returned error", async () => {

      // send a request
      const cid = generateRandomCid();
      const errorCode = 10;
      const hashRepresentingError = ethers.utils.hexZeroPad(BigNumber.from(errorCode).toHexString(), 32);
      let tx = await cid2HashOracleLogic.connect(user01).requestCID2Hash([cid]);
      let res = await tx.wait();

      // read the requestId from logs
      let e = res.events?.find(e => e.event === "ChainlinkRequested");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;
      let requestId;
      if (e?.args) {
        let iface = new ethers.utils.Interface(CID2HashOracleLogicABI.abi);
        let eventData = iface.parseLog(e);
        requestId = eventData.args['id'];
      }
      expect(requestId).to.not.be.undefined;
      expect(requestId).to.match(/0x([0-9a-f]{64})/);

      // simulate the call from the Operatos.sol to CID2HashOracleLogic.sol
      const contractSigner = await ethers.getImpersonatedSigner(oracleOperator.address);
      tx = await cid2HashOracleLogic.connect(contractSigner).fulfillRequestCIDToHash(
        requestId,
        [cid],
        [hashRepresentingError]
      )
      res = await tx.wait();

      expect(await cid2HashOracleLogic.getVerificationStatus(cid)).to.be.equals(errorCode);

      // check that event of error has been emitted
      e = res.events?.find(e => e.event === "CID2HashErrorResponse");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;

    });

    it("Should not record a cid paired with a bytes32(0) hash", async () => {

      // send a request
      const cid = generateRandomCid();
      const emptyHash = ethers.utils.hexZeroPad(BigNumber.from(0).toHexString(), 32);
      let tx = await cid2HashOracleLogic.connect(user01).requestCID2Hash([cid]);
      let res = await tx.wait();

      // read the requestId from logs
      let e = res.events?.find(e => e.event === "ChainlinkRequested");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;
      let requestId;
      if (e?.args) {
        let iface = new ethers.utils.Interface(CID2HashOracleLogicABI.abi);
        let eventData = iface.parseLog(e);
        requestId = eventData.args['id'];
      }
      expect(requestId).to.not.be.undefined;
      expect(requestId).to.match(/0x([0-9a-f]{64})/);

      // simulate the call from the Operatos.sol to CID2HashOracleLogic.sol
      const contractSigner = await ethers.getImpersonatedSigner(oracleOperator.address);
      try {
        tx = await cid2HashOracleLogic.connect(contractSigner).fulfillRequestCIDToHash(
          requestId,
          [cid],
          [emptyHash]
        )
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Empty hash received/);
        return;
      }
      expect.fail();

    });


  });

});
