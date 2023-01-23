import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

// : Hooks
import H, { Routes } from './../../../../Hooks';

// : Components
import C from './../../../../Components';

import M, { iArticle, iEvent } from './../../../../Misc';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

export interface iProps {
  style: StyleProp<ViewStyle>;
  currentCard: iArticle | iEvent;
}

export const SocialBar: React.FC<iProps> = (props) => {
  const nav = H.NPM.navigation.useNavigation();
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'SocialButtons.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'SocialButtons.tsx' });
  const userProfile = H.Queries.useQuery_UserProfile();
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [mutateLike, { isLoading, isSuccess, isError }] = H.Queries.useMutation_FeedLikes(props.currentCard.PostType, props.currentCard.ID);
  const Experiment_ButtonLayout = H.DEV.useExperiment<boolean>({
    key: 'SocialBarButtonsLayout',
    category: 'Feed',
    name: 'News Social Bar Buttons Layout',
    description: 'This Experiment adjusts the layout of the social bar buttons to be more evenly spaced',
    setting: false,
    defaultSetting: false,
  });

  React.useEffect(() => {
    if (userProfile.data?.siteUserListId && props.currentCard.LikedByStringId) {
      const userId = userProfile.data?.siteUserListId;
      setIsLiked(props.currentCard.LikedByStringId.results.join(',').indexOf(userId.toString()) > -1);
      setLikeCount(props.currentCard.LikedByStringId.results.length);
    } else {
      // This else is needed to handle the use case of going from one like back to zero likes
      // Truthy statements do not agree with Sharepoint returning null instead of an empty array when there are no likes...
      setIsLiked(false);
      setLikeCount(0);
    }
  }, [userProfile.data?.siteUserListId, props.currentCard.LikedByStringId]);

  const logLike = () => {
    const postIsLiked = isLiked ? 'T' : 'F';
    logPress(`Liked_${postIsLiked}_${props.currentCard.PostType.substring(0, 1)}_${props.currentCard.ID}`, '1612566665', 'btn', [tags.button]);
  };

  const logSocialBarClick = (btn: string) => {
    logPress(`SocialBar_${btn}_${props.currentCard.PostType.substring(0, 1)}_${props.currentCard.ID}`, '1612566684', 'btn', [tags.button]);
  };

  const handle_Like = () => {
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiked(!isLiked);
    logLike();
    mutateLike({ Post: props.currentCard, userId: userProfile.data?.siteUserListId });
  };
  const handle_Flag = () => {
    nav.navigate(Routes.feedReportPost, { data: props.currentCard });
    logSocialBarClick('Flag');
  };
  const handle_Share = () => {
    nav.navigate(Routes.feedSharePost, { data: props.currentCard });
    logSocialBarClick('Share');
  };
  const handle_Info = () => {
    nav.navigate(Routes.feedPostInfo, { data: props.currentCard });
    logSocialBarClick('Info');
  };

  const LikeComponent = (props: { action: Function }) => {
    const spinner = (
      <C.View style={styles.SpinnerWrap}>
        <C.Spinner style={styles.Spinner} size="small" color="grey" />
      </C.View>
    );
    return isLoading ? (
      spinner
    ) : (
      <C.Pressable style={styles.PressableWrap} onPress={() => props.action()}>
        {isLiked ? <FAIcon style={styles.Icon} name="thumbs-up" /> : <FAIcon style={styles.Icon} name="thumbs-o-up" />}
        <C.Text style={styles.LikeTextColor}>{likeCount.toString()}</C.Text>
      </C.Pressable>
    );
  };

  const PressableIcon = (props: { name: string; action: Function; count?: number }) => {
    return (
      <C.Pressable style={styles.PressableWrap} onPress={() => props.action()}>
        <FAIcon style={styles.Icon} name={props.name} />
        {props.count !== undefined ? <C.Text style={styles.PressableText}>{props.count + ''}</C.Text> : <></>}
      </C.Pressable>
    );
  };

  if (Experiment_ButtonLayout?.setting)
    return (
      <C.View style={[styles.ExperimentViewRoot, props.style]}>
        <LikeComponent action={handle_Like} />
        <PressableIcon name="flag" action={handle_Flag} />
        <PressableIcon name="share-alt" action={handle_Share} />
        <PressableIcon name="info-circle" action={handle_Info} />
      </C.View>
    );

  const { Promote, PromoteFromDate, PromoteEndDate } = props.currentCard;
  const isPromoted =
    Promote &&
    moment().isAfter(M.Tools.ServerTimeToLocal(PromoteFromDate)) &&
    moment().isBefore(M.Tools.ServerTimeToLocal(PromoteEndDate));

  return (
    <C.View>
      <C.View style={[styles.ViewRoot, props.style]}>
        <C.Left>
          <LikeComponent action={handle_Like} />
        </C.Left>

        <C.Right>
          <C.View style={styles.IconView}>
            <PressableIcon name="flag" action={handle_Flag} />
            <PressableIcon name="share-alt" action={handle_Share} />
            <PressableIcon name="info-circle" action={handle_Info} />
          </C.View>
        </C.Right>
      </C.View>
      
      {isPromoted && (
        <C.View style={styles.PromotedContainer}>
          <FAIcon name="star" style={[styles.Icon, styles.StarIcon]} />
          <C.Text style={styles.PromotedText}>Promoted</C.Text>
        </C.View>
      )}
    </C.View>
  );
};

const styles = StyleSheet.create({
  ExperimentViewRoot: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  ViewRoot: {
    flexDirection: 'row',
  },
  PromotedContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
  },
  LikeTextColor: {
    flex: 0,
    alignSelf: 'center',
    fontSize: 18,
    color: M.Colors.veniceBlue,
  },
  IconView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Icon: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 21,
    color: M.Colors.grayComplement,
  },
  StarIcon: {
    color: M.Colors.veniceBlue,
  },
  PromotedText: {
    fontSize: 18,
    color: M.Colors.veniceBlue,
  },
  PressableWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  PressableText: {
    flex: 0,
    alignSelf: 'center',
  },
  SpinnerWrap: {
    flex: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
  Spinner: {
    height: 0,
    padding: 10,
    margin: 0,
  },
});
