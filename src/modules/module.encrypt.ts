import { RowFenceEncryptionResponse } from "../type";

export default class Encryption {
  /**
   * Encryption with row fence cipher
   *
   * @param {string} plainText
   * @param {number} key
   * @param {string} padding
   * @returns {string}
   */
  public rowFence(plainText: string, key?: number, padding?: string): string {
    const minKey = 2;
    const encodeText = encodeURI(plainText);
    const encodeTextLength = encodeText.length;
    if (!key) key = Math.floor(Math.random() * (encodeTextLength - minKey + 1)) + minKey;
    if (key <= 1) key = 2;
    if (key === encodeTextLength) key = encodeTextLength - 1;
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
}
