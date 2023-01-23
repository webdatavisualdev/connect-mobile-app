import helper_EncryptAuthHeader from './../../Tools/helper_EncryptAuthHeader';

export interface iTokens {
  access_token: string;
  id_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
  expires_at?: string;
  error: string;
}

export const fetchTokensInitial = async (token: string): Promise<iTokens> => {
  const url = 'https://login.adventhealth.com/AHConnectAuth/oidctoken.aspx';

  const postData = new FormData();
  postData.append('grant_type', 'authorization_code');
  postData.append('code', token);
  postData.append('redirect_uri', 'ahsemp://main');

  const fetchOptions: RequestInit = {
    method: 'POST',
    body: postData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Basic ${helper_EncryptAuthHeader()}`,
    },
  };

  const response = await fetch(url, fetchOptions);
  const tokens: iTokens = await response.json();

  if (response.ok && tokens.refresh_token) return tokens;
  else throw new Error('Error using initial Token to get tokens');
};

export default fetchTokensInitial;
