// #!/usr/bin/env node

// import {
//     createPublicClient,
//     erc20Abi,
//     extractChain,
//     http,
//     isAddress,
// } from "viem";
// import { bsc, sepolia } from "viem/chains";
// import LaunchPadABI from "./abi/LaunchPad.json";
// import TokenLockerABI from "./abi/TokenLocker.json";
// import { config } from "dotenv";
// config();

// const CONTRACTS = {
//     launchPad: LaunchPadABI,
//     tokenLocker: TokenLockerABI,
// } as const;

// const ASSET_TOKENS = {
//     [bsc.id]: [
//         "0xF5Bc3439f53A45607cCaD667AbC7DAF5A583633F", // AGENT
//         "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
//         "0x4200000000000000000000000000000000000006", // WETH
//     ],
//     [sepolia.id]: [
//         "0x048d64c0B70c16b3f99d01b18e613d24D5DFaEAB", // AGENT
//         "0xa721ffA98e30e54345352C5DB3430C824fC1d4F3", // ALTT
//     ],
// } as const;

// type ContractType = keyof typeof CONTRACTS;

// async function getErc20TickerAndDecimals(tokenAddress: `0x${string}`) {
//     const chainId =
//         process.env.CHAIN_ID ?? process.env.NEXT_PUBLIC_CHAIN_ID ?? "56";

//     const chain = extractChain({
//         chains: [bsc, sepolia],
//         id: parseInt(chainId) as 56 | 11155111,
//     });

//     const client = createPublicClient({
//         chain,
//         transport: http(),
//     });

//     const [ticker, decimals] = await Promise.all([
//         client.readContract({
//             address: tokenAddress,
//             abi: erc20Abi,
//             functionName: "symbol",
//         }),
//         client.readContract({
//             address: tokenAddress,
//             abi: erc20Abi,
//             functionName: "decimals",
//         }),
//     ]);

//     return { ticker, decimals };
// }

// async function makeContractCall(
//     contractType: ContractType,
//     contractAddress: `0x${string}`,
//     methodName: string,
//     args: string[] = [],
// ) {
//     const chainId =
//         process.env.CHAIN_ID ?? process.env.NEXT_PUBLIC_CHAIN_ID ?? "8453";

//     const chain = extractChain({
//         chains: [bsc, sepolia],
//         id: parseInt(chainId) as 56 | 11155111,
//     });

//     const client = createPublicClient({
//         chain,
//         transport: http(),
//     });

//     const contract = {
//         address: contractAddress,
//         abi: CONTRACTS[contractType],
//     };

//     // console.log(
//     //   `Checking ${contractType} contract at ${contractAddress}, method ${methodName} with args ${args.join(", ")}`,
//     // );

//     const result = await client.readContract({
//         ...contract,
//         functionName: methodName,
//         args: args.length ? args : undefined,
//     });

//     return result;
// }

// async function checkContracts() {
//     try {
//         const [, , contractType, contractAddress, methodName, ...args] =
//             process.argv;

//         // Validate contract type
//         if (!contractType || !Object.keys(CONTRACTS).includes(contractType)) {
//             console.error(
//                 "Please specify a valid contract type: factory, manager, or bonding-curve",
//             );
//             process.exit(1);
//         }

//         // Validate contract address
//         if (!contractAddress || !isAddress(contractAddress)) {
//             console.error("Please provide a valid contract address");
//             process.exit(1);
//         }

//         // Validate method name
//         if (!methodName) {
//             console.error("Please specify a method name to call");
//             process.exit(1);
//         }

//         const result = await makeContractCall(
//             contractType as ContractType,
//             contractAddress,
//             methodName,
//             args,
//         );

//         console.log("Result:", result);
//     } catch (error) {
//         console.error("Error checking contracts:", error);
//         process.exit(1);
//     }
// }

// const methods: Record<ContractType, string[]> = {
//     launchPad: [
//         "globalPaused",
//         "bondingCurve",
//         "manager",
//         "taxVault",
//         "owner",
//         "pendingOwner",
//         "fee",
//         "feeToken",
//         "gradTax",
//         "initialSupply",
//         "launchPointPercentage",
//     ],
//     tokenLocker: [
//         "bondingCurve",
//         "pumpAgentFactory",
//         "lpTokenAddr",
//         "swapRouter",
//         "swapFactory",
//         "owner",
//         "pendingOwner",
//     ]
// };

// async function checkAuto() {
//     const args = process.argv.slice(3);

//     let launchPadAddress = process.env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS;
//     let tokenLockerAddress = process.env.CONTRACT_TOKENLOCKER_ADDRESS;

//     if (!launchPadAddress && args.length !== 1) {
//         console.error(
//             "Fail to get factory address from environment variable, please provide it as an argument",
//         );
//         console.error("Usage: npm run check-contracts auto <factory>");
//         process.exit(1);
//     }

//     if (args.length === 1) {
//         const factoryArg = args[0]!;
//         const regex = /^(?:(\d+):)?(.+)$/;
//         const match = regex.exec(factoryArg);
//         if (!match) {
//             console.error(
//                 "Invalid factory address format. Use <address> or <chainId>:<address>",
//             );
//             process.exit(1);
//         }

//         const [, chainId, _factoryAddress] = match;
//         if (chainId) {
//             process.env.CHAIN_ID = chainId;
//         }

//         if (!isAddress(_factoryAddress!)) {
//             console.error("Invalid factory address");
//             process.exit(1);
//         }

//         launchPadAddress = _factoryAddress;
//     }


//     const contractAddresses: Record<ContractType, `0x${string}`> = {
//         launchPad: launchPadAddress as `0x${string}`,
//         tokenLocker: tokenLockerAddress as `0x${string}`,
//     };

//     for (const [contractType, methodList] of Object.entries(methods)) {
//         console.log(
//             `\n\nChecking ${contractType} contract ${contractAddresses[contractType as ContractType]}`,
//         );
//         console.log(
//             "-------------------------------------------------------------------------",
//         );

//         for (const method of methodList) {
//             try {
//                 const result = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     method,
//                 );
//                 console.log(`${method.padEnd(30)}`, result);
//             } catch (error) {
//                 console.error(`Error checking ${contractType}.${method}:`, error);
//             }
//         }

//         // speical handling for factory contract
//         if ((contractType as ContractType) === "launchPad") {
//             try {
//                 const owner = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "owner",
//                 );

//                 const adminRole = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "ADMIN_ROLE",
//                 );

//                 const pauseRole = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "PAUSE_ROLE",
//                 );

//                 const defaultAdminRole = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "DEFAULT_ADMIN_ROLE",
//                 );

//                 const hasAdminRole = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "hasRole",
//                     [adminRole as `0x${string}`, owner as `0x${string}`],
//                 );

//                 console.log("owner hasAdminRole".padEnd(30), hasAdminRole);

//                 const hasDefaultAdminRole = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "hasRole",
//                     [defaultAdminRole as `0x${string}`, owner as `0x${string}`],
//                 );

//                 console.log(
//                     "owner hasDefaultAdminRole".padEnd(30),
//                     hasDefaultAdminRole,
//                 );

//                 const hasPauseRole = await makeContractCall(
//                     contractType as ContractType,
//                     contractAddresses[contractType as ContractType],
//                     "hasRole",
//                     [pauseRole as `0x${string}`, owner as `0x${string}`],
//                 );

//                 console.log("owner hasPauseRole".padEnd(30), hasPauseRole);
//             } catch (error) {
//                 console.error("Error checking owner roles:", error);
//             }

//             // check asset tokens params
//             const chainId = process.env.CHAIN_ID ?? process.env.NEXT_PUBLIC_CHAIN_ID;
//             if (chainId === "8453" || chainId === "84532") {
//                 const assetTokens = ASSET_TOKENS[parseInt(chainId) as 8453 | 84532];
//                 for (const token of assetTokens) {
//                     console.log("\nasset token".padEnd(31), token);

//                     const { ticker, decimals } = await getErc20TickerAndDecimals(
//                         token as `0x${string}`,
//                     );
//                     console.log("  ticker".padEnd(30), ticker);
//                     console.log("  decimals".padEnd(30), decimals);

//                     const isWhitelisted = await makeContractCall(
//                         "factory",
//                         launchPadAddress as `0x${string}`,
//                         "isWhitelisted",
//                         [token],
//                     );
//                     console.log("  isWhiteListed".padEnd(30), isWhitelisted);

//                     const buyTax = await makeContractCall(
//                         "factory",
//                         launchPadAddress as `0x${string}`,
//                         "buyTax",
//                         [token],
//                     );
//                     console.log("  buyTax".padEnd(30), buyTax);

//                     const sellTax = await makeContractCall(
//                         "factory",
//                         launchPadAddress as `0x${string}`,
//                         "sellTax",
//                         [token],
//                     );
//                     console.log("  sellTax".padEnd(30), sellTax);

//                     const initialY = await makeContractCall(
//                         "factory",
//                         launchPadAddress as `0x${string}`,
//                         "initialY",
//                         [token],
//                     );
//                     console.log("  initialY".padEnd(30), initialY);
//                 }
//             }
//         }
//     }
// }

// // Run the script if it's called directly (not imported as a module)
// if (import.meta.url === import.meta.resolve("./check-contracts.ts")) {
//     const args = process.argv.slice(2);

//     if (args.length === 0) {
//         console.log("Usage:");
//         console.log("1. Auto check mode:");
//         console.log("   npm run check-contracts auto <factory>");
//         console.log("\n2. Single contract mode:");
//         console.log(
//             "   npm run check-contracts <contract-type> <address> <method-name> [args...]",
//         );
//         console.log("\nContract types: factory, manager, bonding-curve");
//         process.exit(1);
//     }

//     const mode = args[0];

//     if (mode === "auto") {
//         if (args.length > 2) {
//             console.error("Usage: npm run check-contracts auto [factory]");
//             process.exit(1);
//         }

//         checkAuto()
//             .then(() => {
//                 console.log("\n\nAuto contract check completed successfully");
//                 process.exit(0);
//             })
//             .catch((error) => {
//                 console.error("\n\nAuto contract check failed:", error);
//                 process.exit(1);
//             });
//     } else if (mode && Object.keys(CONTRACTS).includes(mode)) {
//         // Direct contract call mode
//         process.argv = [process.argv[0]!, process.argv[1]!, ...args]; // Reconstruct args for checkContracts

//         checkContracts()
//             .then(() => {
//                 console.log("\n\nContract method check completed successfully");
//                 process.exit(0);
//             })
//             .catch((error) => {
//                 console.error("\n\nContract method check failed:", error);
//                 process.exit(1);
//             });
//     } else {
//         console.error(
//             `Invalid mode or contract type. Use 'auto' or one of: ${Object.keys(CONTRACTS).join(", ")}`,
//         );
//         process.exit(1);
//     }
// }

// export { checkContracts, checkAuto };
