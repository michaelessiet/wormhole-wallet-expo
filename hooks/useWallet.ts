import { useMemo } from "react";
import usePersistState from "./usePersistState";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

export default function useWallet() {
  const [mnemonic, setMnemonic] = usePersistState<string | undefined>(
    "mnemonic",
  );
  const [privateKey, setPrivateKey] = usePersistState<string | undefined>(
    "privateKey",
  );

  const keyPair = useMemo(() => {
    if (privateKey) {
      try {
        const decodedKey = bs58.decode(privateKey);
        return Keypair.fromSecretKey(decodedKey);
      } catch (error) {
        console.error("Error decoding private key:", error);
        return null;
      }
    }

    return null;
  }, [privateKey]);

  const publicKey = useMemo(() => {
    if (keyPair) {
      return keyPair.publicKey.toBase58();
    }
    return null;
  }, [keyPair]);

  return {
    mnemonic,
    setMnemonic,
    setPrivateKey,
    privateKey,
    keyPair,
    publicKey,
  };
}
