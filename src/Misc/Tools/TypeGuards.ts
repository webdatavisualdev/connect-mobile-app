import { iArticle, iEvent } from 'src/Hooks/Queries/useQuery_Feed';

const isArticle = (feedItem: iArticle | iEvent): feedItem is iArticle => {
  return feedItem.PostType === 'article';
};
const isEvent = (feedItem: iArticle | iEvent): feedItem is iArticle => {
  return feedItem.PostType === 'event';
};

const TypeGuards = {
  isArticle,
  isEvent,
};

export default TypeGuards;
