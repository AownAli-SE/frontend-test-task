import CryptoJS from "crypto-js";

const secret = import.meta.env.VITE_SECRET_KEY;

export const encrypt = (message) => {
  return CryptoJS.AES.encrypt(message, secret)?.toString();
};

export const decrypt = (encryptedMessage) => {
  return CryptoJS.AES.decrypt(encryptedMessage, secret)?.toString(CryptoJS.enc.Utf8);
};
