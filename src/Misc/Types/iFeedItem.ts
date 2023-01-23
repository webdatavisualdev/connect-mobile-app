/**
 * This is the base item that iArticle and iEvent extends
 * This interface should be the intersection of those two types
 */
export interface iFeedItem {
  LikedByStringId: {
    __metadata: {
      type: string;
    };
    results: string[];
  };
  LikedByInformation: {
    __deferred: {
      uri: string;
    };
  };
  _ComplianceFlags: any;
  _ComplianceTag: any;
  _ComplianceTagUserId: any;
  _ComplianceTagWrittenTime: any;
  _CopySource: any;
  _EditMenuTableEnd: any;
  _EditMenuTableStart: any;
  _EditMenuTableStart2: any;
  _HasCopyDestinations: any;
  _IsCurrentVersion: any;
  _IsRecord: any;
  _Level: any;
  _ModerationComments: any;
  _ModerationStatus: any;
  _UIVersion: any;
  _UIVersionString: any;
  _VirusInfo: any;
  _VirusStatus: any;
  _VirusVendorID: any;
  AccentColor: AccentColors;
  AccessPolicy: any;
  AppAuthor: any;
  AppEditor: any;
  Attachments: any;
  Author: any;
  AverageRating: any;
  BaseName: any;
  ButtonLink: any;
  ButtonText: any;
  ComplianceAssetId: any;
  ContactPerson: any;
  ContentType: any;
  ContentTypeId: any;
  ContentVersion: any;
  Created_x0020_Date: any;
  Created: any;
  Description: any;
  DocIcon: any;
  Edit: any;
  Editor: any;
  EncodedAbsUrl: any;
  ExpirationDate: any;
  File_x0020_Type: any;
  FileDirRef: any;
  FileLeafRef: any;
  FileRef: any;
  FileSystemObjectType: number;
  FolderChildCount: any;
  FSObjType: any;
  GUID: any;
  HTML_x0020_File_x0020_Type: any;
  Icon: any;
  ID: number;
  InstanceID: any;
  IsButtonPopup: any;
  IsMobileNotificationSent: any;
  ItemChildCount: any;
  Last_x0020_Modified: any;
  LayoutType: any;
  Liked: boolean;
  LikedBy: any;
  LikesCount: any;
  LinkFilename: any;
  LinkFilename2: any;
  LinkFilenameNoMenu: any;
  LinkTitle: any;
  LinkTitle2: any;
  LinkTitleNoMenu: any;
  MetaInfo: any;
  MobileNotification: any;
  MobileNotificationMsg: any;
  Modified: any;
  NewWindow: any;
  NoExecute: any;
  OData__UIVersionString: any;
  Order: any;
  OriginatorId: any;
  owshiddenversion: any;
  PermMask: any;
  PopupContent: any;
  PostType: 'article' | 'event';
  PrincipalCount: any;
  ProgId: any;
  Promote: any;
  PromoteEndDate: any;
  PromoteFromDate: any;
  PublicPost: any;
  PublishDate: any;
  PublishFromDepartment: any;
  PublishFromLocation: any;
  PublishFromTopic: any;
  PublishToDepartment: any;
  PublishToLocation: any;
  PublishToTopic: any;
  PushToUser: any;
  PushToUserApproved: any;
  RatedBy: any;
  RatingCount: any;
  Ratings: any;
  Restricted: any;
  ScopeId: any;
  SelectTitle: any;
  ServerUrl: any;
  SharePost: any;
  SMLastModifiedDate: any;
  SMTotalFileStreamSize: any;
  SMTotalSize: any;
  SortBehavior: any;
  Status: any;
  SuperPromoted: any;
  SyncClientId: any;
  Teaser: any;
  Title: any;
  UniqueId: any;
  VideoUrl: {
    Description: string;
    Url: string;
  };
  Weight: any;
  WorkflowInstanceID: any;
  WorkflowVersion: any;
}

export enum AccentColors {
  'DarkBlue' = 'DarkBlue',
  'Green' = 'Green',
  'LightBlue' = 'LightBlue',
  'LightRed' = 'LightRed',
  'Orange' = 'Orange',
  'Purple' = 'Purple',
}
