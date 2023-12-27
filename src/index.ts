class E2EE {
  /**
   * Encryption with row fence cipher
   *
   * @param {string} plainText
   * @param {number} key
   * @param {string} padding
   * @returns {string}
   */
  public encrypt(plainText: string, key?: number, padding?: string): string {
    const minKey = 2;
    const encodeText = encodeURI(plainText);
    const encodeTextLength = encodeText.length;
    if (!key) key = Math.floor(Math.random() * (encodeTextLength - minKey + 1)) + minKey;
    if (key <= 1) throw new Error("Key must be greater than 1");
    if (!padding) padding = "=";
    const encodeTextArray = encodeText.split("");
    const rows: string[][] = [];
    for (let i = 0; i < key; i++) rows[i] = [];
    for (let j = 0; j < key; j++) {
      for (let k = 0; k < Math.ceil(encodeTextLength / key); k++) {
        const position = key * k + j;
        const text = encodeTextArray[position];
        rows[j].push(text ? text : padding);
      }
    }
    const encryptedText = btoa(rows.map((row) => row.join("")).join(""));
    return [encryptedText, key, padding].join(".");
  }

  /**
   * Decryption with row fence cipher
   *
   * @param {string} encryptedText
   * @param {number} key
   * @param {string} padding
   * @returns {string} plain text
   */
  public decrypt(encryptedText: string, key: number, padding?: string): string {
    if (!padding) padding = "=";
    encryptedText = atob(encryptedText);
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
    return decodeURI(encodeText);
  }
}

export default E2EE;
