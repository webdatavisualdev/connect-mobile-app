import * as React from 'react';
import { ListRenderItemInfo } from 'react-native';

// : Hooks
import H, { iReduxState } from './../../../Hooks';

// : Components
import C from './../../../Components';

import { iArticle, iEvent } from './../../../Misc';

// : Card Types
import { iDefaultCardProps } from './FeedCardLayouts/iDefaultCardProps';
import { DefaultCard } from './FeedCardLayouts/DefaultCard';
import { Alert as Common_Alert } from './FeedCardLayouts/Alert';
import { AlertSkeleton } from './FeedCardLayouts/AlertSkeleton';
import { ArticleImageCard as Common_ImageCard } from './FeedCardLayouts/ArticleImageCard';
import { ArticleImageCardSkelton } from './FeedCardLayouts/ArticleImageCardSkeleton';
import { ImageText as Common_ImageText } from './FeedCardLayouts/ImageText';
import { ImageTextSkeleton } from './FeedCardLayouts/ImageTextSkeleton';
import { VideoText as Common_VideoText } from './FeedCardLayouts/VideoText';
import { VideoTextSkeleton } from './FeedCardLayouts/VideoTextSkeleton';

import { ArticleText } from './FeedCardLayouts/ArticleText';
import { ArticleTextSkeleton } from './FeedCardLayouts/ArticleTextSkeleton';
import { ArticleSideImageText } from './FeedCardLayouts/ArticleSideImageText';
import { ArticleSideImageTextSkeleton } from './FeedCardLayouts/ArticleSideImageTextSkeleton';
import { EventDateText } from './FeedCardLayouts/EventDateText';

export interface iProps extends iDefaultCardProps<iArticle | iEvent> {}

export const FeedCard: React.FC<iProps> = (props) => {
  const logPress = H.Logs.useLog_userPress({ source: 'FeedCard.tsx' });
  const [state, setState] = React.useState(<></>);
  const visualDebugging = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const FullCardData = H.Queries.useQuery_FeedItem(props.feed.item.PostType, props.feed.item.ID, (props.feed.item as any).faked ? props.feed.item : undefined);
  const MemoizedCardData = React.useMemo(() => FullCardData.data, [FullCardData.updatedAt]);
  const Experiment_ForceCardSkeletons = H.DEV.useExperiment<boolean>({
    key: 'ForceFeedSkeletons',
    category: 'Feed',
    name: 'Force Show News Card Skeletons',
    description: 'Force the News Cards to render as skeletons indefinitely',
    setting: false,
    defaultSetting: false,
  });
  const Experiment_ForceCardErrors = H.DEV.useExperiment<boolean>({
    key: 'ForceCardErrors',
    category: 'Feed',
    name: 'Force Show News Card Errors',
    description: 'Force the News Cards to render as their error cards, this will trump Forcing cards to render as skeletons',
    setting: false,
    defaultSetting: false,
  });
  const errMessage = 'Ooops, there was an error loading that card';

  React.useEffect(() => {
    if (FullCardData.isFetched && FullCardData?.data) {
      determineCard();
    }

    if (FullCardData.status === 'success' && FullCardData.data === undefined) {
      FullCardData.refetch();
    }
  }, [FullCardData.updatedAt, props.feed.item.LikedByStringId?.results?.join(',')]);

  React.useEffect(() => {
    determineCard();
  }, [FullCardData.data?.Modified]);

  const determineCard = React.useCallback(() => {
    const layout = props.feed.item.LayoutType;

    if (props.feed.item.PostType === 'article') {
      const cardData: ListRenderItemInfo<iArticle> = { ...props.feed } as ListRenderItemInfo<iArticle>;
      cardData.item = { ...(MemoizedCardData as iArticle), ...props.feed.item };
      let fetchStatus = FullCardData.status;
      if ((cardData.item as any)?.faked) (fetchStatus as any) = 'success';
      if (Experiment_ForceCardSkeletons?.setting) (fetchStatus as any) = 'ForcingSkeletons';
      if (Experiment_ForceCardErrors?.setting) (fetchStatus as any) = 'error';

      switch (layout) {
        case 'ArticleImageText':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_ImageText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967521-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ImageTextSkeleton />);
              break;
          }
          break;

        case 'ArticleImageCard':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_ImageCard feed={cardData} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967729-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ArticleImageCardSkelton />);
              break;
          }
          break;

        case 'ArticleNotification':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_Alert feed={cardData} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967736-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<AlertSkeleton />);
              break;
          }
          break;

        case 'ArticleSideImageText':
          switch (fetchStatus) {
            case 'success':
              setState(<ArticleSideImageText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967748-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ArticleSideImageTextSkeleton />);
              break;
          }
          break;

        case 'ArticleText':
          switch (fetchStatus) {
            case 'success':
              setState(<ArticleText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967756-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ArticleTextSkeleton />);
              break;
          }
          break;

        case 'ArticleVideoText':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_VideoText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967766-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<VideoTextSkeleton />);
              break;
          }
          break;

        default:
          setState(<DefaultCard feed={cardData} />);
      }
    }

    if (props.feed.item.PostType === 'event') {
      const cardData: ListRenderItemInfo<iEvent> = { ...props.feed } as ListRenderItemInfo<iEvent>;
      cardData.item = { ...(MemoizedCardData as iEvent), ...props.feed.item };
      let fetchStatus = FullCardData.status;
      if ((cardData.item as any)?.faked) (fetchStatus as any) = 'success';
      if (Experiment_ForceCardSkeletons?.setting) (fetchStatus as any) = 'ForcingSkeletons';
      if (Experiment_ForceCardErrors?.setting) (fetchStatus as any) = 'error';

      switch (layout) {
        case 'EventImageDateText':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_ImageText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967792-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ImageTextSkeleton />);
          }
          break;

        case 'EventImageCard':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_ImageCard feed={cardData} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967802-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ArticleImageCardSkelton />);
          }
          break;

        case 'EventDateText':
          switch (fetchStatus) {
            case 'success':
              setState(<EventDateText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967814-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<C.View />);
          }
          break;

        case 'EventImageText':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_ImageText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967823-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<ImageTextSkeleton />);
          }
          break;

        case 'EventNotification':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_Alert feed={cardData} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967839-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<AlertSkeleton />);
          }
          break;

        case 'EventVideoText':
          switch (fetchStatus) {
            case 'success':
              setState(<Common_VideoText feed={cardData} hideButton={props.hideButton} />);
              break;
            case 'error':
              setState(
                <C.Error
                  type="Card"
                  errorCode={`1635967844-${cardData.item.PostType}-${cardData.item.LayoutType}-${cardData.item.ID}`}
                  errorMessage={errMessage}
                />,
              );
              break;
            default:
              setState(<VideoTextSkeleton />);
          }
          break;

        default:
          setState(<DefaultCard feed={cardData} />);
      }
    }
  }, [props.feed.item.Modified, props.feed.item.LikedByStringId?.results?.join(','), FullCardData.status]);

  if (visualDebugging) {
    return (
      <C.View style={{ borderWidth: 5, borderColor: 'red', marginVertical: 10 }}>
        <C.Button
          block
          transparent
          onPress={() => {
            logPress(`Visual Debugging - Reload ${props.feed.item.PostType} ${props.feed.item.ID}`, '1632362286', 'btn', []);
            FullCardData.refetch();
          }}>
          <C.Text>Reload Card Data</C.Text>
        </C.Button>
        <C.Text>Weight: {props.feed.item.Weight}</C.Text>
        <C.Text>
          Promoted: {FullCardData.data?.Promote ? 'T' : 'F'}, Status: {FullCardData.data?.Status}
        </C.Text>
        <C.Text>LayoutType: {FullCardData.data?.LayoutType}</C.Text>
        <C.Text>Full Card Data: (Status: {FullCardData.status})</C.Text>
        <C.JSONTree data={FullCardData.data} shouldExpandNode={() => false} />
        <C.Text>Data Passed from News (Parent):</C.Text>
        <C.JSONTree data={props.feed.item} shouldExpandNode={() => false} />
        {state}
      </C.View>
    );
  }
  return state;
};
