import { iFeedItem } from './iFeedItem';

export interface iArticle extends iFeedItem {
  _CommentCount: any;
  _CommentFlags: any;
  ImageUrl?: { Description: string; Url: string };
  SMTotalFileCount: any;
}
