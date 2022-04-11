import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// This is our governance contract.
const vote = sdk.getVote("0x935a9819990e389ffb8643F2652FE81b1047d6B3");
const token = sdk.getToken("0x9BEA06288D4102d31D3Cd0aA2Df3F29A566407BD");
//const proposals = await vote.getAll();
//console.log(proposals);

(async () => {
try {
    // Create proposal to transfer ourselves 500 tokens for being awesome.
    const amount = 500;
    const description = "Should the Contract DAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being the founder?";
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