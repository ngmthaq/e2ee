import { RowFenceEncryptionResponse } from "../type";

export default class Encryption {
  /**
   * Encryption with row fence cipher
   *
   * @param {string} plainText
   * @param {number} key
   * @param {string} padding
   * @returns {RowFenceEncryptionResponse} { encryptedText: string , key: number, padding: string }
   */
  public rowFence(plainText: string, key?: number, padding?: string): RowFenceEncryptionResponse {
    const minKey = 2;
    const plainTextLength = plainText.length;
    if (!key) key = Math.floor(Math.random() * (plainTextLength - minKey + 1)) + minKey;
    if (key <= 1) key = 2;
    if (key === plainTextLength) key = plainTextLength - 1;
    if (!padding) padding = "=";
    const plainTextArray = plainText.split("");
    const rows: string[][] = [];
    for (let i = 0; i < key; i++) rows[i] = [];
    for (let j = 0; j < key; j++) {
      for (let k = 0; k < Math.ceil(plainTextLength / key); k++) {
        const position = key * k + j;
        const text = plainTextArray[position];
        rows[j].push(text ? text : padding);
      }
    }
    const encryptedText = encodeURI(btoa(rows.map((row) => row.join("")).join("")));
    return { encryptedText, key, padding };
  }
}
