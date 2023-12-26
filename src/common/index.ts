import { Encryption, Decryption } from "../modules";

const encrypt = new Encryption();
const decrypt = new Decryption();

window.Hash = { encrypt, decrypt };
