import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { address } from "gill";
import { buildTransferTokensTransaction } from "gill/dist/programs/token";

export function generateMnemonic(strength: 128 | 256 = 128): string {
  return bip39.generateMnemonic(strength);
}

export function deriveSolanaKeypair(
  mnemonic: string,
  accountIndex = 0,
): { keypair: Keypair; privateKeyBase58: string } {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase provided.");
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const derivationPath = `m/44'/501'/${accountIndex}'/0'`;
  const derivedSeed = ed25519.derivePath(
    derivationPath,
    seed.toString("hex"),
  ).key;

  const keypair = Keypair.fromSeed(derivedSeed.subarray(0, 32));
  const privateKeyBase58 = bs58.encode(keypair.secretKey);

  return { keypair, privateKeyBase58 };
}

export async function generateSolTransferTransaction(
  amount: number,
  from: Keypair,
  to: string,
  connection: Connection,
) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: new PublicKey(to),
      lamports: amount,
    }),
  );

  transaction.feePayer = from.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
}

export async function generateSPLTransferTransactionWithGill(
  amount: number,
  fromSigner: Keypair, // Gill uses KeyPairSigner
  toAddress: string,
  mintAddress: string,
  solanaClient: Connection, // Gill's client
): Promise<TransactionMessageWithBlockhashLifetime> {
  const to = address(toAddress); // Convert string to Gill's address type
  const mint = address(mintAddress); // Convert string to Gill's address type

  // 1. Fetch mint information to get decimals
  // We'll use the rpc instance from the solanaClient
  const mintInfo = await getMint(solanaClient.rpc, mint);
  const decimals = mintInfo.decimals;

  // 2. Calculate the amount in the smallest token unit
  const amountInSmallestUnit = BigInt(
    Math.round(amount * Math.pow(10, decimals)),
  );

  if (amountInSmallestUnit <= 0) {
    throw new Error("Transfer amount must be greater than 0.");
  }

  // 3. Get the latest blockhash
  const latestBlockhash = await solanaClient.rpc.getLatestBlockhash().send();

  // 4. Build the transfer tokens transaction using Gill's builder [5, 6]
  // This builder handles ATA creation for the recipient if needed.
  const transactionMessage = buildTransferTokensTransaction({
    mint,
    destination: to,
    amount: amountInSmallestUnit,
    authority: fromSigner, // The sender's KeyPairSigner acts as the authority
    payer: fromSigner, // The sender will pay for the transaction fees (and potential ATA creation)
    // fundRecipient: true, // This is often true by default or handled internally if ATA needs creation
    // The `buildTransferTokensTransaction` will determine the source ATA from the `authority` and `mint`.
  });

  // 5. Set the transaction lifetime using the blockhash
  const transactionMessageWithLifetime: TransactionMessageWithBlockhashLifetime =
    {
      ...transactionMessage,
      lifetimeConstraint: {
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
    };

  // The transaction message is now ready to be signed and sent.
  // To sign: `const signedTransaction = await signTransactionMessageWithSigners(transactionMessageWithLifetime, [fromSigner]);`
  // To send: `const signature = await solanaClient.sendAndConfirmTransaction(signedTransaction);`
  return transactionMessageWithLifetime;
}
