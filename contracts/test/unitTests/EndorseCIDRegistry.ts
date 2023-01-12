import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {CID2HashRegistry, EndorseCIDRegistry} from "../../typechain-types";
import {deployCID2HashRegistry} from "../../scripts/Deployer/SingleContracts/CID2HashRegistry";
import {generateRandomCid, generateRandomHash} from "../../scripts/utils/CID";
import {deployEndorseCIDRegistry} from "../../scripts/Deployer/SingleContracts/EndorseCIDRegistry";
import {time} from "@nomicfoundation/hardhat-network-helpers";


describe("EndorseCIDRegistry", () => {

  let deployer: SignerWithAddress;
  let user01: SignerWithAddress;
  let user02: SignerWithAddress;
  let user03: SignerWithAddress;
  let endorseCIDRegistry: EndorseCIDRegistry;

  before(async () => {
    const [us0, us1, us2, us3] = await ethers.getSigners();
    deployer = us0;
    user01 = us1;
    user02 = us2;
    user03 = us3;
  })

  describe("deploy", async () => {

    it("Should deploy correctly", async () => {
      endorseCIDRegistry = await deployEndorseCIDRegistry(deployer);
      expect(endorseCIDRegistry.address).to.not.be.undefined;
    });

  });

  describe("Endorse CID", async () => {

    it("Should endorse a CID sent by the user directly", async () => {
      let cid = generateRandomCid();
      await endorseCIDRegistry.connect(user01).endorseCID([cid]);
      expect(await endorseCIDRegistry.endorseStatus(cid, user01.address)).to.be.true;
    });

    it("Should endorse a CID sent by the another user, using the user01 sign", async () => {
      let cidList = [generateRandomCid()];
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      // console.log("dataToSign", dataToSign);
      console.log("dataToSignHash", dataToSignHash);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      await endorseCIDRegistry.connect(user02).endorseCIDWithSign(
        cidList,
        user01.address,
        validAfter,
        validBefore,
        signature.v,
        signature.r,
        signature.s
      );
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
    });

  });



});
