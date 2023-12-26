import { Decryption, Encryption } from "./modules";

declare global {
  interface Window {
    Hash: {
      encrypt: Encryption;
      decrypt: Decryption;
    };
  }
}
