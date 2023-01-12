import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CHAIN_CONSTANTS} from "../../scripts/ProjectConstants";
import {TEST_CHAIN_ID} from "../_setup/TestConstants";
import {ethers} from "hardhat";
import {CID2HashOracleLogic, CID2HashRegistry, EndorseCIDRegistry, Operator} from "../../typechain-types";
import CID2HashOracleLogicABI from "../../artifacts/contracts/CID2HashOracleLogic.sol/CID2HashOracleLogic.json";
import OperatorABI from "@chainlink/contracts/abi/v0.7/Operator.json";
import {deployCID2HashOracleLogic} from "../../scripts/Deployer/SingleContracts/CID2HashOracleLogic";
import {BigNumber} from "ethers";
import {deployOperator} from "../../scripts/Deployer/SingleContracts/ChainLinkOracle/Operator";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import {deploy} from "../../scripts/Deployer/deploy";


const SAMPLE_IPFS_CID_v0: string = "QmVnWhM2qYr9JkjGLaEVSZnCprRLDW8qns1oYYVXjnb4DA";
const SAMPLE_IPFS_CID_v1: string = "bafybeigrw5qh2bvbrno2nsd7fwctensc662zxen4h6b3bmypdbbvtz36ma";
let ORACLE_ADDRESS: string = "";

describe("CID2HashOracleLogic", () => {

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
    const deployedStack = await deploy(
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

    it("Should correctly fulfill the request", async () => {

      // send a request
      const cid = 'QmpoUYer77Z14xgmQjYEiHjVjMFXzCVVEcRTYuRTNNdreT';
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(cid));  // generated a random one, just for testing purpose
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

      // add fake ETH to the Oracle.sol contract to mock the callback
      await setBalance(oracleOperator.address, ethers.utils.parseEther('10'));
      const contractSigner = await ethers.getImpersonatedSigner(oracleOperator.address);
      await cid2HashOracleLogic.connect(contractSigner).fulfillRequestCIDToHash(
        requestId,
        [cid],
        [hash]
      )

      expect(await cid2HashRegistry.getHashFromCID(cid)).to.be.equals(hash);
      const cidList = await cid2HashRegistry.getCIDsFromHash(hash);
      expect(cidList.length).to.be.equals(1);
      expect(cidList[0]).to.be.equals(cid);

    })
  });

});
