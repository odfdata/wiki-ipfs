import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {CID2HashRegistry} from "../../typechain-types";
import {deployCID2HashRegistry} from "../../scripts/Deployer/SingleContracts/CID2HashRegistry";
import {generateRandomCid, generateRandomHash} from "../../scripts/utils/CID";

let DEFAULT_ADMIN_ROLE = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 32);
const WRITER_ROLE = ethers.utils.solidityKeccak256(["string"], ["WRITER_ROLE"]);
describe("CID2HashRegistry", () => {

  let deployer: SignerWithAddress;
  let user01: SignerWithAddress;
  let user02: SignerWithAddress;
  let user03: SignerWithAddress;
  let cid2HashRegistry: CID2HashRegistry;

  before(async () => {
    const [us0, us1, us2, us3] = await ethers.getSigners();
    deployer = us0;
    user01 = us1;
    user02 = us2;
    user03 = us3;
  })

  describe("Deploy", async () => {

    it("Should deploy correctly", async () => {
      cid2HashRegistry = await deployCID2HashRegistry(deployer);

      // check that DEFAULT_ADMIN_ROLE role has been assigned to deployer
      let hasRoleAdmin = await cid2HashRegistry.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
      expect(hasRoleAdmin).to.be.true;

      // check that DEFAULT_ADMIN_ROLE is not assigned to user01
      let hasRoleUSer01 = await cid2HashRegistry.hasRole(DEFAULT_ADMIN_ROLE, user01.address);
      expect(hasRoleUSer01).to.be.false;
    });

  });

  describe("Add a new hash", async () => {

    it("Should fail as user01 has not the WRITER_ROLE", async() => {
      const cid = generateRandomCid();
      const hash = generateRandomHash();
      try {
        await cid2HashRegistry.connect(user01).addHash(cid, hash);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(new RegExp(`account ${user01.address.toLowerCase()} is missing role ${WRITER_ROLE}`));
        return;
      }
    })

    it("Should fail as deployer has not the WRITER_ROLE", async() => {
      const cid = generateRandomCid();
      const hash = generateRandomHash();
      try {
        await cid2HashRegistry.connect(deployer).addHash(cid, hash);
      } catch (e: any) {
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.match(new RegExp(`account ${deployer.address.toLowerCase()} is missing role ${WRITER_ROLE}`));
        return;
      }
    })

    it("Grant user01 WRITER_ROLE", async() => {
      await cid2HashRegistry.connect(deployer).grantRole(WRITER_ROLE, user01.address);
      expect(await cid2HashRegistry.hasRole(WRITER_ROLE, user01.address));
    })


    it("Save a pair cid-hash with a user that hash WRITER_ROLE", async() => {
      const cid = generateRandomCid();
      const hash = generateRandomHash();
      await cid2HashRegistry.connect(user01).addHash(cid, hash);
      expect(await cid2HashRegistry.getHashFromCID(cid)).to.be.equals(hash);
      let cidList = await cid2HashRegistry.getCIDsFromHash(hash);
      expect(cidList.length).to.be.equals(1);
      expect(cidList[0]).to.be.equals(cid);
    })

  })

  describe("Test CID and Hash getters", async () => {
    let cid1 = generateRandomCid();
    let cid2 = generateRandomCid();
    let hash = generateRandomHash();

    before(async () => {
      await cid2HashRegistry.connect(user01).addHash(cid1, hash);
      await cid2HashRegistry.connect(user01).addHash(cid2, hash);
    });

    it("Should get the correct CID from hash", async () => {
      let cid = await cid2HashRegistry.getCIDsFromHash(hash);
      expect(cid.length).to.be.equals(2);
      expect(cid[0]).to.be.equals(cid1);
      expect(cid[1]).to.be.equals(cid2);
    });

    it("Should get the correct hash from CID", async () => {
      let hash1 = await cid2HashRegistry.getHashFromCID(cid1);
      let hash2 = await cid2HashRegistry.getHashFromCID(cid2);
      expect(hash1).to.be.equals(hash);
      expect(hash2).to.be.equals(hash);
    });


  });
});
