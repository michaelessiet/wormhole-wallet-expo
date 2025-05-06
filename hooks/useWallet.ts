import { useMemo } from "react";
import usePersistState from "./usePersistState";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { useToastController } from "@tamagui/toast";
import { deriveSolanaKeypair, generateMnemonic } from "utils";

export default function useWallet() {
  const [mnemonic, setMnemonic] = usePersistState<string | undefined>(
    "mnemonic",
  );
  const [privateKey, setPrivateKey] = usePersistState<string | undefined>(
    "privateKey",
  );
  const toast = useToastController();

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

  const walletExists = useMemo(() => {
    if (mnemonic) {
      return true;
    }
    if (privateKey) {
      return true;
    }
    return false;
  }, [mnemonic, privateKey]);

  const publicKey = useMemo(() => {
    if (keyPair) {
      return keyPair.publicKey.toBase58();
    }
    return null;
  }, [keyPair]);

  function generateWallet() {
    try {
      if (walletExists) {
        return toast.show("Wallet already exists", {
          customData: { type: "error" },
        });
      }

      toast.show("Generating mnemonic", {
        customData: { spinner: true },
      });
      const mnem = generateMnemonic();
      setMnemonic(mnem);
      toast.hide();

      toast.show("Deriving private key", {
        customData: { spinner: true },
      });
      const generatedKeypair = deriveSolanaKeypair(mnem);
      setPrivateKey(generatedKeypair.privateKeyBase58);
      toast.hide();

      toast.show("✅ Wallet successfully generated");
    } catch (e) {
      console.error("Error generating wallet:", e);
      toast.show("Error generating wallet", {
        customData: { type: "error" },
      });
    }
  }

  return {
    mnemonic,
    setMnemonic,
    setPrivateKey,
    privateKey,
    keyPair,
    walletExists,
    publicKey,
    generateWallet,
  };
}
