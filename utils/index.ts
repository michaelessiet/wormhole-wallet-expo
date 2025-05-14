import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import {
  type Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";

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

export async function generateSPLTransferTransaction(
  amount: number,
  from: Keypair,
  to: string,
  mint: string,
  connection: Connection,
): Promise<Transaction> {
  const fromPublicKey = from.publicKey;
  const toPublicKey = new PublicKey(to);
  const mintPublicKey = new PublicKey(mint);

  const mintInfo = await getMint(connection, mintPublicKey);
  const decimals = mintInfo.decimals;

  const amountInSmallestUnit = BigInt(Math.round(amount * 10 ** decimals));

  if (amountInSmallestUnit <= 0) {
    throw new Error("Transfer amount must be greater than 0.");
  }

  const fromAta = getAssociatedTokenAddressSync(
    mintPublicKey,
    fromPublicKey,
    false, // allowOwnerOffCurve - typically false for wallet addresses
  );

  const toAta = getAssociatedTokenAddressSync(
    mintPublicKey,
    toPublicKey,
    false, // allowOwnerOffCurve
  );

  const transaction = new Transaction();

  const recipientAtaInfo = await connection.getAccountInfo(toAta);
  if (!recipientAtaInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        fromPublicKey,
        toAta,
        toPublicKey,
        mintPublicKey,
      ),
    );
  }

  transaction.add(
    createTransferInstruction(
      fromAta,
      toAta,
      fromPublicKey,
      amountInSmallestUnit,
      [],
    ),
  );

  const { blockhash } = await connection.getLatestBlockhash();

  transaction.feePayer = fromPublicKey;
  transaction.recentBlockhash = blockhash;

  return transaction;
}

export function truncateAddress(address: string, start = 4, end = 4): string {
  if (address.length <= start + end) {
    return address;
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
