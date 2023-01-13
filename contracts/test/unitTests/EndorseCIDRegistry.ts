import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {EndorseCIDRegistry} from "../../typechain-types";
import {generateRandomCid} from "../../scripts/utils/CID";
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

  describe ("Test Endorse Status", async () => {

    it("Should be false if no endorse is made", async () => {
      let cid = [generateRandomCid()];
      let endorseStatus = await endorseCIDRegistry.endorseStatus(cid[0], user01.address);
      expect(endorseStatus).to.be.false;
    });

    it("Should be true if an endorse is made", async () => {
      let cid = [generateRandomCid()];
      await endorseCIDRegistry.connect(user01).endorseCID(cid);
      let endorseStatus = await endorseCIDRegistry.endorseStatus(cid[0], user01.address);
      expect(endorseStatus).to.be.true;
    });

    it("Should be false if an endorse is made by user01 and the check happens on user02", async () => {
      let cid = [generateRandomCid()];
      await endorseCIDRegistry.connect(user01).endorseCID(cid);
      let endorseStatus = await endorseCIDRegistry.endorseStatus(cid[0], user02.address);
      expect(endorseStatus).to.be.false;
    });

  })

  describe("Endorse CID", async () => {

    it("Should endorse a CID sent by the user directly", async () => {
      let cid = generateRandomCid();
      await endorseCIDRegistry.connect(user01).endorseCID([cid]);
      expect(await endorseCIDRegistry.endorseStatus(cid, user01.address)).to.be.true;
    });

    it("Should endorse a CID sent by another user, using the user01 sign", async () => {
      let cidList = [generateRandomCid()];
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
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

    it("Should endorse 3 CIDs sent by another user, using the user01 sign", async () => {
      let cidList = [generateRandomCid(), generateRandomCid(), generateRandomCid()];
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
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
      expect(await endorseCIDRegistry.endorseStatus(cidList[1], user01.address)).to.be.true;
      expect(await endorseCIDRegistry.endorseStatus(cidList[2], user01.address)).to.be.true;
    });

    it("Should fail when endorsing a CID sent by the another user, using a not yet valid user01 sign", async () => {
      let cidList = [generateRandomCid()];
      let validAfter = (await time.latest()) + 300;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).endorseCIDWithSign(
          cidList,
          user01.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      }  catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Not yet in the validity timeframe/);
        return;
      }
      expect.fail();
    });

    it("Should fail when endorsing a CID sent by the another user, using an expired user01 sign", async () => {
      let cidList = [generateRandomCid()];
      let validAfter = (await time.latest()) - 5000;
      let validBefore = (await time.latest()) - 300;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).endorseCIDWithSign(
          cidList,
          user01.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      }  catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Validity expired/);
        return;
      }
      expect.fail();
    });

    it("Should fail when endorsing a CID sent by the another user, using sign and exceeding MAX_SIGN_VALIDITY", async () => {
      let cidList = [generateRandomCid()];
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + (await endorseCIDRegistry.MAX_SIGN_VALIDITY()).toNumber() + 5;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).endorseCIDWithSign(
          cidList,
          user01.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Max sign validity exceeds MAX_SIGN_VALIDITY/);
        return;
      }
      expect.fail();
    });

    it("Should fail when endorsing a CID sent by the another user, using user01 sign and trying to endorse user02", async () => {
      let cidList = [generateRandomCid()];
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + (await endorseCIDRegistry.MAX_SIGN_VALIDITY()).toNumber() - 100;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).endorseCIDWithSign(
          cidList,
          user02.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Invalid Sign/);
        return;
      }
      expect.fail();
    });

  });

  describe("Oppose CID", async () => {

    it("Should oppose a CID sent by the user directly", async () => {
      let cid = generateRandomCid();
      await endorseCIDRegistry.connect(user01).endorseCID([cid]);
      expect(await endorseCIDRegistry.endorseStatus(cid, user01.address)).to.be.true;
      await endorseCIDRegistry.connect(user01).opposeCID([cid]);
      expect(await endorseCIDRegistry.endorseStatus(cid, user01.address)).to.be.false;
    });

    it("Should oppose a CID sent by another user, using the user01 sign", async () => {
      let cidList = [generateRandomCid()];
      // start by endorsing a CID, then later opposing with a sign
      await endorseCIDRegistry.connect(user01).endorseCID(cidList);
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      await endorseCIDRegistry.connect(user02).opposeCIDWithSign(
        cidList,
        user01.address,
        validAfter,
        validBefore,
        signature.v,
        signature.r,
        signature.s
      );
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.false;
    });

    it("Should oppose 3 CIDs sent by another user, using the user01 sign", async () => {
      let cidList = [generateRandomCid(), generateRandomCid(), generateRandomCid()];
      // start by endorsing a CID, then later opposing with a sign
      await endorseCIDRegistry.connect(user01).endorseCID(cidList);
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
      expect(await endorseCIDRegistry.endorseStatus(cidList[1], user01.address)).to.be.true;
      expect(await endorseCIDRegistry.endorseStatus(cidList[2], user01.address)).to.be.true;
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      await endorseCIDRegistry.connect(user02).opposeCIDWithSign(
        cidList,
        user01.address,
        validAfter,
        validBefore,
        signature.v,
        signature.r,
        signature.s
      );
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.false;
      expect(await endorseCIDRegistry.endorseStatus(cidList[1], user01.address)).to.be.false;
      expect(await endorseCIDRegistry.endorseStatus(cidList[2], user01.address)).to.be.false;
    });

    it("Should fail when opposing a CID sent by the another user, using a not yet valid user01 sign", async () => {
      let cidList = [generateRandomCid()];
      // start by endorsing a CID, then later opposing with a sign
      await endorseCIDRegistry.connect(user01).endorseCID(cidList);
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
      let validAfter = (await time.latest()) + 300;
      let validBefore = (await time.latest()) + 3600;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).opposeCIDWithSign(
          cidList,
          user01.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      }  catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Not yet in the validity timeframe/);
        return;
      }
      expect.fail();
    });

    it("Should fail when opposing a CID sent by the another user, using an expired user01 sign", async () => {
      let cidList = [generateRandomCid()];
      // start by endorsing a CID, then later opposing with a sign
      await endorseCIDRegistry.connect(user01).endorseCID(cidList);
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
      let validAfter = (await time.latest()) - 5000;
      let validBefore = (await time.latest()) - 300;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).opposeCIDWithSign(
          cidList,
          user01.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      }  catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Validity expired/);
        return;
      }
      expect.fail();
    });

    it("Should fail when opposing a CID sent by the another user, using sign and exceeding MAX_SIGN_VALIDITY", async () => {
      let cidList = [generateRandomCid()];
      // start by endorsing a CID, then later opposing with a sign
      await endorseCIDRegistry.connect(user01).endorseCID(cidList);
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + (await endorseCIDRegistry.MAX_SIGN_VALIDITY()).toNumber() + 5;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).opposeCIDWithSign(
          cidList,
          user01.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Max sign validity exceeds MAX_SIGN_VALIDITY/);
        return;
      }
      expect.fail();
    });

    it("Should fail when endorsing a CID sent by the another user, using user01 sign and trying to endorse user02", async () => {
      let cidList = [generateRandomCid()];
      // start by endorsing a CID, then later opposing with a sign
      await endorseCIDRegistry.connect(user01).endorseCID(cidList);
      expect(await endorseCIDRegistry.endorseStatus(cidList[0], user01.address)).to.be.true;
      let validAfter = (await time.latest()) - 1;
      let validBefore = (await time.latest()) + (await endorseCIDRegistry.MAX_SIGN_VALIDITY()).toNumber() - 100;
      let dataToSign = ethers.utils.defaultAbiCoder.encode(
        ["string[]", "address", "uint256", "uint256"],
        [cidList, user01.address, validAfter, validBefore]
      );
      let dataToSignHash = ethers.utils.keccak256(dataToSign);
      let signatureLike = await user01.signMessage(ethers.utils.arrayify(dataToSignHash));
      let signature = ethers.utils.splitSignature(signatureLike);

      try {
        await endorseCIDRegistry.connect(user02).opposeCIDWithSign(
          cidList,
          user02.address,
          validAfter,
          validBefore,
          signature.v,
          signature.r,
          signature.s
        );
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(/Invalid Sign/);
        return;
      }
      expect.fail();
    });

  });



});
