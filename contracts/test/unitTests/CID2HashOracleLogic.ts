import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CHAIN_CONSTANTS} from "../../scripts/ProjectConstants";
import {TEST_CHAIN_ID} from "../_setup/TestConstants";
import {ethers} from "hardhat";
import {CID2HashOracleLogic} from "../../typechain-types";
import CID2HashOracleLogicABI from "../../artifacts/contracts/CID2HashOracleLogic.sol/CID2HashOracleLogic.json";
import {deployCID2HashOracleLogic} from "../../scripts/Deployer/SingleContracts/CID2HashOracleLogic";
import {BigNumber} from "ethers";

const SAMPLE_IPFS_CID_v0: string = "QmVnWhM2qYr9JkjGLaEVSZnCprRLDW8qns1oYYVXjnb4DA";
const SAMPLE_IPFS_CID_v1: string = "bafybeigrw5qh2bvbrno2nsd7fwctensc662zxen4h6b3bmypdbbvtz36ma";

describe("CID2HashOracleLogic", () => {

  let deployer: SignerWithAddress;
  let user01: SignerWithAddress;
  let user02: SignerWithAddress;
  let user03: SignerWithAddress;
  let cid2HashOracleLogic: CID2HashOracleLogic;

  before(async () => {
    const [us0, us1, us2, us3] = await ethers.getSigners();
    deployer = us0;
    user01 = us1;
    user02 = us2;
    user03 = us3;
  })

  describe("Constructor parameters", async () => {
    it("Should deploy with correct constructor parameters", async () => {
      cid2HashOracleLogic = await deployCID2HashOracleLogic(
        deployer,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].JOD_ID,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].ORACLE_ADDRESS,
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
      expect(tokenAddress).to.eq(cid2HashOracleLogic.ORACLE_PAYMENT_TOKEN_ADDRESS);
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



  describe("Owner Functions", async () => {

    

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

  });

});
