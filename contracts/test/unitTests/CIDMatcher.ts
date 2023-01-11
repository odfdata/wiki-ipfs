import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CHAIN_CONSTANTS} from "../../scripts/ProjectConstants";
import {TEST_CHAIN_ID} from "../_setup/TestConstants";
import {ethers} from "hardhat";
import {deployCIDMatcher} from "../../scripts/Deployer/SingleContracts/CIDMatcher";
import {CIDMatcher} from "../../typechain-types";
import CIDMatcherABI from "../../artifacts/contracts/CIDMatcher.sol/CIDMatcher.json";

const SAMPLE_IPFS_CID_v0: string = "QmVnWhM2qYr9JkjGLaEVSZnCprRLDW8qns1oYYVXjnb4DA";
const SAMPLE_IPFS_CID_v1: string = "bafybeigrw5qh2bvbrno2nsd7fwctensc662zxen4h6b3bmypdbbvtz36ma";

describe("CIDMatcher", () => {

  let deployer: SignerWithAddress;
  let user01: SignerWithAddress;
  let user02: SignerWithAddress;
  let user03: SignerWithAddress;
  let cidMatcher: CIDMatcher;

  before(async () => {
    const [us0, us1, us2, us3] = await ethers.getSigners();
    deployer = us0;
    user01 = us1;
    user02 = us2;
    user03 = us3;
  })

  describe("Constructor parameters", async () => {
    it("Should deploy with correct constructor parameters", async () => {
      cidMatcher = await deployCIDMatcher(
        deployer,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].JOD_ID,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].ORACLE_ADDRESS,
        CHAIN_CONSTANTS[TEST_CHAIN_ID].PAY_TOKEN_ADDRESS
      );
    });

    it("Should return chainlink token address", async () => {
      let clTokenAddress = await cidMatcher.connect(user01).getChainlinkToken();
      expect(clTokenAddress).to.be.equals(CHAIN_CONSTANTS[TEST_CHAIN_ID].PAY_TOKEN_ADDRESS);
    });

  });



  describe("Verification request", async () => {

    it("Should correctly add verification", async () => {
      let tx = await cidMatcher.connect(user01).storeHashGivenIpfs([SAMPLE_IPFS_CID_v0]);
      let res = await tx.wait();
      let e = res.events?.find(e => e.event === "NewIPFSHashRequest");
      expect(e).to.not.be.undefined;
      expect(e?.args).to.be.length(1);
      if (e?.args) {
        let iface = new ethers.utils.Interface(CIDMatcherABI.abi);
        let eventData = iface.parseLog(e);
        expect(eventData.args['_cidList'][0]).to.be.equals(SAMPLE_IPFS_CID_v0);
      }
    });

    it("Should fail (empty string array)", async () => {
      try {
        await cidMatcher.connect(user01).storeHashGivenIpfs([]);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Empty array/);
        return;
      }
      expect.fail();
    });

  })



  describe("Owner Functions", async () => {

    it("Should change Oracle Payment", async () => {
      let payment = ethers.utils.parseEther("2.3");
      await cidMatcher.connect(deployer).setOraclePayment(payment);
      let readPayment = await cidMatcher.ORACLE_PAYMENT();
      expect(readPayment).to.be.equals(payment);
    });

    it("Should fail (only Owner can change Oralce Payment)", async () => {
      let payment = ethers.utils.parseEther("2.3");
      try {
        await cidMatcher.connect(user01).setOraclePayment(payment);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Only callable by owner/);
        return;
      }
      expect.fail();
    });

  });

});
