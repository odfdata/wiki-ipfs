import {ethers} from "hardhat";

export const deployOracle = async () => {
  
  const [owner] = await ethers.getSigners();

}

if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "31415" | "1337" = "31415";
  deployOracle()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
