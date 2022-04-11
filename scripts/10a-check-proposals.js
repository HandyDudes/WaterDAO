import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// This is our governance contract.
const vote = sdk.getVote("0x935a9819990e389ffb8643F2652FE81b1047d6B3");

const proposals = await vote.getAll();
console.log(proposals);
const voteupdate = vote.setVotingPeriod(6570);
console.log(voteupdate);
const quorumupdate = vote.quorum(1);
console.log(quorumupdate);