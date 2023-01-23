import { encode as btoa } from 'base-64';

export const helper_EncryptAuthHeader = () => {
  const clientId = '964140fea1e642449e048e21744346a0';
  const clientSecret = 'd7960732e624ecbd4430670706d8411980f9a6edc252edd169fa6d20777c121d';
  return btoa(`${clientId}:${clientSecret}`);
};

export default helper_EncryptAuthHeader;
