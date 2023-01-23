import * as Keychain from 'react-native-keychain';
import { encrypt, decrypt } from './helper_Crypto';

export interface SaveProps {
  username: string;
  encryptionKey?: string;
  password: string;
  KeychainOpt: Keychain.Options;
}

export interface GetProps {
  encryptionKey?: string;
  KeychainOpt: Keychain.Options;
}

export const SaveToKeychain = async (opt: SaveProps) => {
  const encryptedValue = opt.encryptionKey ? encrypt(opt.password, opt.encryptionKey) : opt.password;

  try {
    await Keychain.setGenericPassword(opt.username, encryptedValue, opt.KeychainOpt);
  } catch (error) {
    console.error('Something went wrong while saving a value to the Keychain', error);
  }

  return true;
};

export const GetFromKeychain = async (opt: GetProps) => {
  const maybeEncryptedVal = await Keychain.getGenericPassword(opt.KeychainOpt);
  if (maybeEncryptedVal) {
    if (opt.encryptionKey && opt.encryptionKey.length > 0) {
      return decrypt(maybeEncryptedVal.password, opt.encryptionKey);
    } else {
      return maybeEncryptedVal;
    }
  } else {
    throw new Error('Something went wrong while retrieving a value from the Keychain, No Record Found.');
  }
};

export const KeychainExists = async (service: string) => {
  const keychainResponse = await Keychain.getGenericPassword({ service });
  if (keychainResponse === false) {
    return false;
  } else {
    return true;
  }
};
