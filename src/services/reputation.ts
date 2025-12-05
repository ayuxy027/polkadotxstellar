// src/services/reputation.ts
import { 
  Address, 
  Contract, 
  Networks, 
  TransactionBuilder, 
  xdr, 
  scValToNative, 
  Horizon, 
  rpc 
} from "@stellar/stellar-sdk";
import albedo from "@albedo-link/intent";

// Soroban RPC server for testnet
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org", { allowHttp: true });

// Horizon server for account info
const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org", { allowHttp: true });

// TODO: Replace with your actual deployed contract ID
const CONTRACT_ID = "CB2DAM4PEJ23P2OL236C23WXMRP2HYN4AFW3LLLKFYYP7EFUGLHEFRPP";

const NETWORK_PASSPHRASE = Networks.TESTNET;

/**
 * Convert string to Vec<u8> ScVal for Soroban
 */
function stringToBytes(str: string): xdr.ScVal {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return xdr.ScVal.scvBytes(new Uint8Array(bytes));
}

/**
 * Load account details from Horizon
 */
async function getAccount(publicKey: string) {
  return await horizonServer.loadAccount(publicKey);
}

/**
 * Build and sign a transaction using Albedo
 */
async function buildAndSignTransaction(
  sourceAccount: string,
  contract: Contract,
  method: string,
  args: xdr.ScVal[]
) {
  const account = await getAccount(sourceAccount);

  const contractCall = contract.call(method, ...args);

  const transaction = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contractCall)
    .setTimeout(180)
    .build();

  // Sign transaction with Albedo
  const signedResult = await albedo.tx({
    xdr: transaction.toXDR(),
    network: "testnet",
  });

  if (!signedResult.signed_envelope_xdr) {
    throw new Error("Transaction signing failed");
  }

  return signedResult.signed_envelope_xdr;
}

/**
 * Submit a signed transaction to Soroban
 */
async function submitTransaction(signedXdr: string) {
  const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const sendResponse = await rpcServer.sendTransaction(transaction);

  if (sendResponse.errorResult) {
    throw new Error(`Transaction failed: ${JSON.stringify(sendResponse.errorResult)}`);
  }

  return sendResponse;
}

/**
 * Fetch credential from the contract (simulation)
 */
export async function getCredential(userAddress: string) {
  try {
    const contract = new Contract(CONTRACT_ID);
    const userScVal = Address.fromString(userAddress).toScVal();
    const account = await getAccount(userAddress);

    const transaction = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("get_credential", userScVal))
      .setTimeout(180)
      .build();

    const simulateResponse = await rpcServer.simulateTransaction(transaction);

    // Check if simulation was successful and has a result
    if (rpc.Api.isSimulationError(simulateResponse)) {
      return null;
    }

    if (!simulateResponse.result?.retval) return null;

    const metadataBytes = scValToNative(simulateResponse.result.retval) as Uint8Array;
    if (!metadataBytes) return null;

    const metadataHash = Array.from(metadataBytes).map((b) => b.toString(16).padStart(2, "0")).join("");

    return { user: userAddress, metadataHash };
  } catch (err) {
    console.error("Error getting credential:", err);
    return null;
  }
}

/**
 * Mint new credential
 */
export async function mintCredential(userAddress: string, metadataHash: string) {
  const contract = new Contract(CONTRACT_ID);
  const userScVal = Address.fromString(userAddress).toScVal();
  const metadataScVal = stringToBytes(metadataHash);

  const signedXdr = await buildAndSignTransaction(userAddress, contract, "mint_credential", [
    userScVal,
    metadataScVal,
  ]);

  return await submitTransaction(signedXdr);
}

/**
 * Revoke credential
 */
export async function revokeCredential(userAddress: string) {
  const contract = new Contract(CONTRACT_ID);
  const userScVal = Address.fromString(userAddress).toScVal();

  const signedXdr = await buildAndSignTransaction(userAddress, contract, "revoke_credential", [
    userScVal,
  ]);

  return await submitTransaction(signedXdr);
}
