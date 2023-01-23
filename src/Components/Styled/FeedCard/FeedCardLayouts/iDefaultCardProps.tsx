import { ListRenderItemInfo } from 'react-native';

export interface iDefaultCardProps<postType> {
  feed: ListRenderItemInfo<postType>;
  hideButton?: boolean;
}
