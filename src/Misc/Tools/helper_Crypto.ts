import CryptoJS from 'crypto-js';

export const encrypt = (value: string, cryptKey: string) => {
  return CryptoJS.AES.encrypt(value, cryptKey).toString();
};

export const decrypt = (value: string, cryptKey: string) => {
  return CryptoJS.AES.decrypt(value, cryptKey).toString(CryptoJS.enc.Utf8);
};

const Crypto = {
  encrypt,
  decrypt,
};

export default Crypto;
