// Sample Url : https://www.google.com/searchResults.html?query=Kittens&type=native
import { URL, URLSearchParams } from 'react-native-url-polyfill';

export interface iUrlBreakdown {
  url: string;
  protocol: string;
  host: string;
  path: string;
  fileExtension?: string;
  queryString: URLSearchParams;
}

export const helper_BreakDownUrl = (url: string): iUrlBreakdown => {
  const urlObj = new URL(url);
  const fileType = urlObj.pathname.split('.')[1];
  return {
    url,
    protocol: urlObj.protocol,
    host: urlObj.hostname,
    path: urlObj.pathname,
    fileExtension: fileType,
    queryString: urlObj.searchParams,
  };
};

export default helper_BreakDownUrl;
