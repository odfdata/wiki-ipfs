import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CHAIN_CONSTANTS} from "../../scripts/ProjectConstants";
import {TEST_CHAIN_ID} from "../_setup/TestConstants";
import {ethers} from "hardhat";
import {CID2HashOracleLogic, Operator} from "../../typechain-types";
import CID2HashOracleLogicABI from "../../artifacts/contracts/CID2HashOracleLogic.sol/CID2HashOracleLogic.json";
import {deployCID2HashOracleLogic} from "../../scripts/Deployer/SingleContracts/CID2HashOracleLogic";
import {BigNumber} from "ethers";
import {deployOperator} from "../../scripts/Deployer/SingleContracts/ChainLinkOracle/Operator";
import {time} from "@nomicfoundation/hardhat-network-helpers";
import {deployCID2HashRegistry} from "../../scripts/Deployer/SingleContracts/CID2HashRegistry";


let ORACLE_ADDRESS: string = "";

describe("CID2HashOracleLogic", () => {

  let deployer: SignerWithAddress;
  let user01: SignerWithAddress;
  let user02: SignerWithAddress;
  let user03: SignerWithAddress;
  let fakeOracleOwner: SignerWithAddress;  // used to simulate fulfillment callbacks
  let cid2HashOracleLogic: CID2HashOracleLogic;
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
  })

  describe("Constructor parameters", async () => {
    it("Should deploy with correct constructor parameters", async () => {
      cid2HashOracleLogic = await deployCID2HashOracleLogic(
        deployer,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].JOD_ID,
        ORACLE_ADDRESS,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].PAY_TOKEN_ADDRESS
      );
    });

    it("Should return payment token address", async () => {
      let payTokenAddress = await cid2HashOracleLogic.connect(user01).getChainlinkToken();
      expect(payTokenAddress).to.be.equals(CHAIN_CONSTANTS[TEST_CHAIN_ID].PAY_TOKEN_ADDRESS);
    });

  });

  describe("Getters", async () => {

    it('getVerificationStatus - Should return the correct status for a given CID', async () => {
      const cid = 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V';
      await cid2HashOracleLogic.requestCID2Hash([cid]);
      const status = await cid2HashOracleLogic.getVerificationStatus(cid);
      expect(status).to.be.equals(BigNumber.from(1));
    });

    it('getVerificationStatus - Should return 0 for non-existing CID', async () => {
      const cid = 'Qmn0n0n0n0n0n0n0n0n0n0n0n0FXzCVVEcRTWJBmLgn0n0';
      const status = await cid2HashOracleLogic.getVerificationStatus(cid);
      expect(status).to.be.equals(0);
    });

    it('getChainlinkToken - Should return the correct chainlink token address', async () => {
      const tokenAddress = await cid2HashOracleLogic.getChainlinkToken();
      expect(tokenAddress).to.eq(await cid2HashOracleLogic.ORACLE_PAYMENT_TOKEN_ADDRESS());
    });

  })

  describe("Verification request", async () => {

    it("Should correctly add verification", async () => {
      const cid = 'QmpoUYer77Z14xgmQjYEiHjVjMFXzCVVEcRTYuRTNNdreT';  // TODO create a function to generate random CIDs
      let tx = await cid2HashOracleLogic.connect(user01).requestCID2Hash([cid]);
      let res = await tx.wait();
      let e = res.events?.find(e => e.event === "CID2HashRequest");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.be.length(1);
      if (e?.args) {
        let iface = new ethers.utils.Interface(CID2HashOracleLogicABI.abi);
        let eventData = iface.parseLog(e);
        expect(eventData.args['_cidList'][0]).to.be.equals(cid);
      }
      const status = await cid2HashOracleLogic.getVerificationStatus(cid);
      expect(status).to.be.equals(BigNumber.from(1));
    });

    it("Should fail (empty string array)", async () => {
      try {
        await cid2HashOracleLogic.connect(user01).requestCID2Hash([]);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Empty array/);
        return;
      }
      expect.fail();
    });

    it('Should fail if the input array size exceeds MAX_CID_PER_VERIFICATION', async () => {
      const cids = Array.from({ length: 11 }, (_, i) => i.toString());
      try {
        await cid2HashOracleLogic.connect(user01).requestCID2Hash(cids);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/MAX_CID_PER_VERIFICATION exceeded/);
        return;
      }
    });

  })

  describe("Verification fulfillment", async () => {
    // All tested in the integration tests
  });

  describe("Owner Functions", async () => {
    it("withdrawLink - Should withdraw payment token correctly", async () => {
      // send some Payment token
      // TODO - simulate token transfer + withdraw
    });

    it("cancelRequest - Should cancel the verification request", async () => {
      // send a request
      const cid = 'QmpoUYer77Z14xgmQjYEiHjVjMFXzCVVEcRTYuRTNNdreT';
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(cid));  // generated a random one, just for testing purpose
      let tx = await cid2HashOracleLogic.connect(user01).requestCID2Hash([cid]);
      let res = await tx.wait();
      let blockTimestamp = (await ethers.provider.getBlock(res.blockNumber)).timestamp;
      let requestValidUntil = blockTimestamp + (await oracleOperator.getExpiryTime()).toNumber();

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

      // get function Id
      let functionId = ethers.utils.id('fulfillRequestCIDToHash(bytes32,string[],bytes32[])').substring(0, 10);

      // set the timestamp of the next block to be after the expiration of the request (usually 5 mins)
      await time.setNextBlockTimestamp(requestValidUntil + 1);

      // call the cancel request
      tx = await cid2HashOracleLogic.connect(deployer).cancelRequest(requestId, 0, functionId, requestValidUntil);
      res = await tx.wait();
      e = res.events?.find(e => e.event === "ChainlinkCancelled");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.not.be.undefined;
    });

    it("setJobId - Should set a new jobId", async() => {
      let jobId = "ababababab";
      await cid2HashOracleLogic.connect(deployer).setJobId(jobId);
      expect(ethers.utils.parseBytes32String(await cid2HashOracleLogic.jobId())).to.be.equals(jobId);
    })

    it("setJobId - Should fail in setting a new jobId (not Owner)", async() => {
      try {
        await cid2HashOracleLogic.connect(user01).setJobId("ababababab");
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Only callable by owner/);
        return;
      }
      expect.fail();
    })

    it("setOraclePayment - Should change Oracle Payment", async () => {
      let payment = ethers.utils.parseEther("2.3");
      await cid2HashOracleLogic.connect(deployer).setOraclePayment(payment);
      let readPayment = await cid2HashOracleLogic.ORACLE_PAYMENT();
      expect(readPayment).to.be.equals(payment);
    });

    it("setOraclePayment - Should fail (only Owner can change Oralce Payment)", async () => {
      let payment = ethers.utils.parseEther("2.3");
      try {
        await cid2HashOracleLogic.connect(user01).setOraclePayment(payment);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Only callable by owner/);
        return;
      }
      expect.fail();
    });

    it("setOraclePaymentTokenAddress - Should change Oracle Payment Token address", async () => {
      let newPaymentTokenAddress = ethers.utils.getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
      await cid2HashOracleLogic.connect(deployer).setOraclePaymentTokenAddress(newPaymentTokenAddress);
      let readAddress = await cid2HashOracleLogic.ORACLE_PAYMENT_TOKEN_ADDRESS();
      expect(readAddress).to.be.equals(newPaymentTokenAddress);
      expect(await cid2HashOracleLogic.getChainlinkToken()).to.be.equals(newPaymentTokenAddress);
    });

    it("setOraclePayment - Should fail (only Owner can change Oralce Payment Token address)", async () => {
      let newPaymentTokenAddress = ethers.utils.getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
      try {
        await cid2HashOracleLogic.connect(user01).setOraclePaymentTokenAddress(newPaymentTokenAddress);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Only callable by owner/);
        return;
      }
      expect.fail();
    });

    it("setCid2HashRegistryAddress - Should change Oracle Payment Token address", async () => {
      let oldCid2HashRegistryAddress = await cid2HashOracleLogic.Cid2HashRegistryContract();
      let newCid2HashAddress = await deployCID2HashRegistry(deployer);
      await cid2HashOracleLogic.connect(deployer).setCid2HashRegistryAddress(newCid2HashAddress.address);
      let cid2HashRegistryContractAddress = await cid2HashOracleLogic.Cid2HashRegistryContract();
      expect(cid2HashRegistryContractAddress).to.be.equals(newCid2HashAddress.address);
      // bring back to old address
      await cid2HashOracleLogic.connect(deployer).setCid2HashRegistryAddress(oldCid2HashRegistryAddress);
    });

    it("setCid2HashRegistryAddress - Should fail (only Owner can change Oralce Payment Token address)", async () => {
      let newCid2HashAddress = await deployCID2HashRegistry(deployer);
      try {
        await cid2HashOracleLogic.connect(user01).setCid2HashRegistryAddress(newCid2HashAddress.address);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Only callable by owner/);
        return;
      }
      expect.fail();
    });

  });

});
