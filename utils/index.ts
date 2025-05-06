import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

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
  const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;

  const keypair = Keypair.fromSeed(derivedSeed.subarray(0, 32));
  const privateKeyBase58 = bs58.encode(keypair.secretKey);

  return { keypair, privateKeyBase58 };
}
