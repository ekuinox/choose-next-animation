import { AES, enc } from "crypto-js";

export const encryptAccessToken = (word: string) => {
    return AES.encrypt(word, process.env.AES_KEY).toString();
};

export const decryptAccessToken = (word: string) => {
    return AES.decrypt(word, process.env.AES_KEY).toString(enc.Utf8);
};
