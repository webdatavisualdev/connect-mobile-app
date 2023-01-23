export interface iMyLinksRecord {
  Id: number;
  ID: number;
  Title: string;
  user: string;
  MyLinks: iMyLinksEncasement;
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
  GUID: string;
}

export interface iMyLinksEncasement {
  links: iMyLinks[];
}

export interface iMyLinks {
  link: string;
  displayName: string;
  mobileCompatible: boolean;
  OpenInNewWindow: boolean;
}
