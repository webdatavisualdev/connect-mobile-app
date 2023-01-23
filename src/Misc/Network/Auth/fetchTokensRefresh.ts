import helper_EncryptAuthHeader from './../../Tools/helper_EncryptAuthHeader';
import { iTokens } from './fetchTokensInitial';

export const fetchTokensRefresh = async (refreshToken: string) => {
  try {
    const url = 'https://login.adventhealth.com/AHConnectAuth/oidctoken.aspx';
    const authHeader = helper_EncryptAuthHeader();

    const postData = new FormData();
    postData.append('grant_type', 'refresh_token');
    postData.append('refresh_token', refreshToken);

    const response = await fetch(url, {
      method: 'POST',
      body: postData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Basic ${authHeader}`,
      },
    });
    const responseJSON = await response.json();

    const tokens: iTokens = responseJSON;
    return tokens;
  } catch (error) {
    throw new Error(`Error while refreshing tokens`);
  }
};

export default fetchTokensRefresh;
