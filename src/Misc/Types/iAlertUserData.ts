export interface iAlertUserData {
  GUID: string;
  ID: number;
  Id: number;
  Title: string;
  Users: string;
  MyAlerts: iMyAlerts[];
  Modified: string;
  Created: string;
  AuthorId: number;
  EditorId: number;
}

export interface iMyAlerts {
  approvalSource: string;
  title: string;
  totalCount: string;
}
