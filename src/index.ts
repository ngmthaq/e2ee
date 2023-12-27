export class E2EEGenerator {
  protected vigenereKeyRegex = /[a-zA-Z]/gm;
  protected keyRegex = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,})$/gm;

  /**
   * Check if the Character is letter or not
   *
   * @param {string} string character to check
   * @return {RegExpMatchArray} An array with the character or null if isn't a letter
   */
  protected isLetter(string: string): RegExpMatchArray {
    return string.length === 1 && string.match(/[a-zA-Z]/i);
  }

  /**
   * Random string
   *
   * @param {numer} length
   * @returns {string}
   */
  protected randomString(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  /**
   * Random letter
   *
   * @param {numer} length
   * @returns {string}
   */
  protected randomLetter(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  /**
   * Random number
   *
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  protected randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Check if is Uppercase or Lowercase
   *
   * @param character
   * @returns {boolean}
   */
  protected isUpperCase(character: string): boolean {
    return character === character.toUpperCase();
  }

  /**
   * Encryption with row fence cipher
   *
   * @param {string} plainText
   * @param {number} key
   * @returns {string}
   */
  public rowFenceEncrypt(plainText: string, key: number): string {
    key = key > 1 ? key : 2;
    const plainTextLength = plainText.length;
    const padding = "=";
    const plainTextArray = plainText.split("");
    const rows: string[][] = [];
    for (let i = 0; i < key; i++) {
      rows[i] = [];
    }
    for (let j = 0; j < key; j++) {
      for (let k = 0; k < Math.ceil(plainTextLength / key); k++) {
        const position = key * k + j;
        const text = plainTextArray[position];
        rows[j].push(text ? text : padding);
      }
    }
    const encryptedText = rows.map((row) => row.join("")).join("");
    return encryptedText;
  }

  /**
   * Decryption with row fence cipher
   *
   * @param {string} encryptedText
   * @param {number} key
   * @returns {string} plain text
   */
  public rowFenceDecrypt(encryptedText: string, key: number): string {
    try {
      key = key > 1 ? key : 2;
      const padding = "=";
      const encryptedTextLength = encryptedText.length;
      const encryptedTextArray = encryptedText.split("");
      const columns = Math.round(encryptedTextLength / key);
      const rows: string[][] = [];
      const plainTextRows: string[][] = [];
      for (let i = 0; i < key; i++) {
        for (let j = 0; j < columns; j++) {
          if (!rows[i]) rows[i] = [];
          const position = i * columns + j;
          rows[i].push(encryptedTextArray[position]);
        }
      }
      for (let p = 0; p < columns; p++) {
        plainTextRows[p] = rows.map((row) => row[p]);
      }
      const decryptedText = plainTextRows.map((row) => row.join("")).join("");
      const encodeTextArray = [];
      for (let k = decryptedText.length; k > 0; k--) {
        const char = decryptedText[k - 1];
        if (char !== padding) encodeTextArray.push(char);
      }
      const encodeText = encodeTextArray.reverse().join("");
      return encodeText;
    } catch {
      return encryptedText;
    }
  }

  /**
   * Encrypt a Vigenere cipher
   *
   * @param {string} message string to be encrypted
   * @param {string} key key for encrypt
   * @return {string} encrypted string
   */
  public vigenereEncrypt(message: string, key: string): string {
    let result = "";
    for (let i = 0, j = 0; i < message.length; i++) {
      const c = message.charAt(i);
      if (this.isLetter(c)) {
        if (this.isUpperCase(c)) {
          result += String.fromCharCode(((c.charCodeAt(0) + key.toUpperCase().charCodeAt(j) - 2 * 65) % 26) + 65);
        } else {
          result += String.fromCharCode(((c.charCodeAt(0) + key.toLowerCase().charCodeAt(j) - 2 * 97) % 26) + 97);
        }
      } else {
        result += c;
      }
      j = ++j % key.length;
    }
    return result;
  }

  /**
   * Decrypt a Vigenere cipher
   *
   * @param {string} message string to be decrypted
   * @param {string} key key for decrypt
   * @return {string} decrypted string
   */
  public vigenereDecrypt(message: string, key: string): string {
    try {
      let result = "";
      for (let i = 0, j = 0; i < message.length; i++) {
        const c = message.charAt(i);
        if (this.isLetter(c)) {
          if (this.isUpperCase(c)) {
            result += String.fromCharCode(90 - ((25 - (c.charCodeAt(0) - key.toUpperCase().charCodeAt(j))) % 26));
          } else {
            result += String.fromCharCode(122 - ((25 - (c.charCodeAt(0) - key.toLowerCase().charCodeAt(j))) % 26));
          }
        } else {
          result += c;
        }
        j = ++j % key.length;
      }
      return result;
    } catch {
      return message;
    }
  }

  /**
   * Full encrypt
   *
   * @param {string} input
   * @param {string} masterKey
   * @param {string} personalKey
   * @returns {string | null}
   */
  public encrypt(input: string, masterKey: string, personalKey: string = ""): string | null {
    try {
      const key = masterKey + personalKey;
      if (!key) throw new Error("Key must not be empty");
      if (key.match(this.keyRegex) === null) throw new Error("Key must contain number and letter (a-z, A-Z) and must be more than 6 characters");
      if (isNaN(parseInt(key[0]))) throw new Error("First character of key must be in number");
      const k0 = encodeURI(input);
      const k1 = btoa(k0);
      const k2 = this.vigenereEncrypt(k1, key.match(this.vigenereKeyRegex).join(""));
      const k3 = this.rowFenceEncrypt(k2, parseInt(key[0]));
      return k3;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  /**
   * Full decrypt
   *
   * @param {string} input
   * @param {string} masterKey
   * @param {string} personalKey
   * @returns {string | null}
   */
  public decrypt(input: string, masterKey: string, personalKey: string = ""): string | null {
    try {
      const key = masterKey + personalKey;
      if (!key) throw new Error("Key must not be empty");
      if (key.match(this.keyRegex) === null) throw new Error("Key must contain number and letter (a-z, A-Z) and must be more than 6 characters");
      if (isNaN(parseInt(key[0]))) throw new Error("First character of key must be in number");
      const k0 = this.rowFenceDecrypt(input, parseInt(key[0]));
      const k1 = this.vigenereDecrypt(k0, key.match(this.vigenereKeyRegex).join(""));
      const k2 = atob(k1);
      const k3 = decodeURI(k2);
      return k3;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  /**
   * Generate Master key
   *
   * @returns {string}
   */
  public generateMasterKey(): string {
    const firstChar = this.randomInt(0, 9);
    const secondChar = this.randomLetter(1);
    const restChars = this.randomString(14);
    return firstChar + secondChar + restChars;
  }

  /**
   * Generate Personal key
   *
   * @returns {string}
   */
  public generatePersonalKey(): string {
    return this.randomString(16);
  }
}

export const E2EE = new E2EEGenerator();
