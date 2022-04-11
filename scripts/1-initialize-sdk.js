import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";
import chalk from "chalk";

import dotenv from "dotenv";
dotenv.config();

// quick test of env variables...
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑"  + chalk.red( "Private key not found."));
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑"  + chalk.red( "Alchemy API URL not found."));
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === ""){
  console.log("🛑" + chalk.red(" Wallet Address not found."));
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // private key
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("SDK init by address:", address)
  } catch (err) {
    console.log("Failed to get apps from the SDK.", err);
    process.exit(1);
  }
})();

export default sdk;
