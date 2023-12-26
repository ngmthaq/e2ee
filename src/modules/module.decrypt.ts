export default class Decryption {
  /**
   * Decryption with row fence cipher
   *
   * @param {string} encryptedText
   * @param {number} key
   * @param {string} padding
   * @returns {string} plain text
   */
  public rowFence(encryptedText: string, key: number, padding?: string): string {
    if (!padding) padding = "=";
    encryptedText = atob(decodeURI(encryptedText));
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
    const plainTextArray = [];
    for (let k = decryptedText.length; k > 0; k--) {
      const char = decryptedText[k - 1];
      if (char !== padding) plainTextArray.push(char);
    }
    return plainTextArray.reverse().join("");
  }
}
