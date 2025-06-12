const { ethers, network } = require("hardhat");
const web3 = require("@solana/web3.js");
const {
  getAccount,
  getAssociatedTokenAddress,
  NATIVE_MINT
} = require("@solana/spl-token");
const config = require("../test/config.js");
const {
  deployContract,
  setupSPLTokens,
  setupATAAccounts,
  approveSplTokens
} = require("../test/composability/utils.js");

async function main() {
  const RECEIPTS_COUNT = 1;
  const connection = new web3.Connection(config.svm_node[network.name], "processed");

  const tokenA = NATIVE_MINT.toBase58(); // wSOL
  const WSOL = "0xc7Fc9b46e479c5Cb42f6C458D1881e55E6B7986c";

  console.log("Deploying to network:", network.name);

  // Deploy main contract
  const { deployer, user: neonEVMUser, contract: CallRaydiumProgram } = await deployContract("CallRaydiumProgram", null);
  const payer = await CallRaydiumProgram.getPayer();

  // Setup tokens
  const tokenB = await setupSPLTokens();
  await setupATAAccounts(ethers.encodeBase58(payer), [tokenA, tokenB]);

  const erc20ForSplFactory = await ethers.getContractFactory("contracts/token/ERC20ForSpl/erc20_for_spl.sol:ERC20ForSpl");
  const tokenA_Erc20ForSpl = erc20ForSplFactory.attach(WSOL);
  const tokenB_Erc20ForSpl = await ethers.deployContract(
    "contracts/token/ERC20ForSpl/erc20_for_spl.sol:ERC20ForSpl",
    [ethers.zeroPadValue(ethers.toBeHex(ethers.decodeBase58(tokenB)), 32)]
  );
  await tokenB_Erc20ForSpl.waitForDeployment();

  console.log("TokenB ERC20ForSPL deployed:", tokenB_Erc20ForSpl.target);

  const [approvedTokenA, approvedTokenB] = await approveSplTokens(
    tokenA,
    tokenB,
    tokenA_Erc20ForSpl,
    tokenB_Erc20ForSpl,
    deployer
  );

  // Claim tokenA
  let tx = await tokenA_Erc20ForSpl.connect(deployer).claim(
    ethers.zeroPadValue(ethers.toBeHex(ethers.decodeBase58(approvedTokenA)), 32),
    ethers.parseUnits("0.05", 9)
  );
  await tx.wait(RECEIPTS_COUNT);
  console.log("Claimed tokenA");

  // Claim tokenB
  tx = await tokenB_Erc20ForSpl.connect(deployer).claim(
    ethers.zeroPadValue(ethers.toBeHex(ethers.decodeBase58(approvedTokenB)), 32),
    ethers.parseUnits("1000", 9)
  );
  await tx.wait(RECEIPTS_COUNT);
  console.log("Claimed tokenB");

  // Approve tokens for CallRaydiumProgram
  await (await tokenA_Erc20ForSpl.connect(deployer).approve(CallRaydiumProgram.target, ethers.MaxUint256)).wait(RECEIPTS_COUNT);
  await (await tokenB_Erc20ForSpl.connect(deployer).approve(CallRaydiumProgram.target, ethers.MaxUint256)).wait(RECEIPTS_COUNT);
  console.log("Approved tokenA and tokenB");

  // Optional: create pool immediately
  const txCreate = await CallRaydiumProgram.connect(deployer).createPool(
    tokenA_Erc20ForSpl.target,
    tokenB_Erc20ForSpl.target,
    20000000,
    10000000,
    0
  );
  await txCreate.wait(RECEIPTS_COUNT);
  console.log("Pool created:", txCreate.hash);

  const poolId = await CallRaydiumProgram.getCpmmPdaPoolId(
    0,
    ethers.zeroPadValue(ethers.toBeHex(ethers.decodeBase58(tokenA)), 32),
    ethers.zeroPadValue(ethers.toBeHex(ethers.decodeBase58(tokenB)), 32)
  );
  console.log("Pool ID:", poolId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
