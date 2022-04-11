import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// This is our governance contract.
const vote = sdk.getVote("0x935a9819990e389ffb8643F2652FE81b1047d6B3");

// This is our Token Proxy Module ERC-20 contract.
const token = sdk.getToken("0x9BEA06288D4102d31D3Cd0aA2Df3F29A566407BD");

(async () => {
  try {
    // Create proposal to mint 22,000 new token to the treasury.
    const amount = 22_000;
    const description = "Should the Contract of our DAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // Create proposal to transfer ourselves 5432 tokens for being awesome.
    const amount = 5432;
    const description = "Should the Contract DAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being our founder?";
    const executions = [
      {
        // Again, we're sending ourselves 0 ETH. Just sending our own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We're doing a transfer from the treasury to our wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );

    const proposals = await vote.getAll();
    console.log(proposals);

  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();

