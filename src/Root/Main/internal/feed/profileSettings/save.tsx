import * as React from 'react';

// : Hooks
import H, { Routes, iReduxState } from './../../../../../Hooks';

// : Components
import C from './../../../../../Components';

export const Save: React.FC = () => {
  const logPress = H.Logs.useLog_userPress({ source: 'profileSettings/save.tsx' });
  const debug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const Route = H.NPM.navigation.useRoute();
  const nav = H.NPM.navigation.useNavigation();

  const [mutate1, status1] = H.Queries.useMutation_UserProfileProperty();
  const [mutate2, status2] = H.Queries.useMutation_UserProfileProperty();
  const [mutate3, status3] = H.Queries.useMutation_UserProfileProperty();
  const [mutate4, status4] = H.Queries.useMutation_UserProfileProperty();

  const feed = H.Queries.useQuery_Feed();
  const userProfile = H.Queries.useQuery_UserProfile();

  const [paramPrimaryLocation, setParamPrimaryLocation] = React.useState<string>();
  const [paramSecondaryLocation, setParamSecondaryLocation] = React.useState<string[]>();
  const [paramTeam, setParamTeam] = React.useState<string>();
  const [paramTopics, setParamTopics] = React.useState<string[]>();

  // const [stepStatus, setStepStatus] = React.useState<{ [key: string]: 'inProgress' | 'done' | 'error' }>({});
  const stepStat = React.useRef<{ [key: string]: 'inProgress' | 'done' | 'error' }>({});

  React.useEffect(() => {
    const params: any = Route.params;
    if (params.primaryLocation) {
      setParamPrimaryLocation(params.primaryLocation);
    }
    if (params.secondaryLocation) {
      setParamSecondaryLocation(params.secondaryLocation);
    }
    if (params.team) {
      setParamTeam(params.team);
    }
    if (params.topics) {
      setParamTopics(params.topics);
    }

    // KickOff
    async_Process();
  }, []);

  React.useEffect(() => {
    async_Process();
  });

  const async_Process = () => {
    if (paramPrimaryLocation && stepStat.current['primaryLocation'] === undefined) {
      stepStat.current = { ...stepStat.current, primaryLocation: 'inProgress' };
      mutate1({ key: 'PrimaryLocation', value: paramPrimaryLocation }).then((done) => {
        stepStat.current = { ...stepStat.current, primaryLocation: 'done' };
      });
    }

    if (paramSecondaryLocation && stepStat.current['secondaryLocations'] === undefined) {
      stepStat.current = { ...stepStat.current, secondaryLocations: 'inProgress' };
      mutate2({ key: 'SecondaryLocations', value: paramSecondaryLocation }).then((done) => {
        stepStat.current = { ...stepStat.current, secondaryLocations: 'done' };
      });
    }

    if (paramTeam && stepStat.current['team'] === undefined) {
      stepStat.current = { ...stepStat.current, team: 'inProgress' };
      mutate3({ key: 'Teams', value: paramTeam }).then((done) => {
        stepStat.current = { ...stepStat.current, team: 'done' };
      });
    }

    if (paramTopics && stepStat.current['topics'] === undefined) {
      stepStat.current = { ...stepStat.current, topics: 'inProgress' };
      mutate4({ key: 'UserTopics', value: paramTopics }).then((done) => {
        stepStat.current = { ...stepStat.current, topics: 'done' };
      });
    }

    if (
      stepStat.current['primaryLocation'] === 'done' &&
      stepStat.current['secondaryLocations'] === 'done' &&
      stepStat.current['team'] === 'done' &&
      stepStat.current['topics'] === 'done' &&
      stepStat.current['reloadUserProfile'] === undefined
    ) {
      stepStat.current = { ...stepStat.current, reloadUserProfile: 'inProgress' };
      userProfile.refetch().then((done) => {
        stepStat.current = { ...stepStat.current, reloadUserProfile: 'done' };
      });
    }

    if (stepStat.current['reloadUserProfile'] === 'done' && stepStat.current['reloadFeed'] === undefined) {
      stepStat.current = { ...stepStat.current, reloadFeed: 'inProgress' };
      feed.refetch().then((done) => {
        stepStat.current = { ...stepStat.current, reloadFeed: 'done' };
      });
    }
  };

  const isDone = () => {
    return stepStat.current['reloadFeed'] === 'done';
  };

  const handle_goToFeed = () => {
    logPress('Go to Feed from Settings Save', '1620838856', 'btn');
    nav.navigate(Routes.feed);
  };

  return (
    <C.Container>
      <C.Content style={{ padding: 15, backgroundColor: '#f6f6f6' }}>
        <C.Card style={{ justifyContent: 'center', padding: 15 }}>
          <C.CardItem key="debug" style={{ flexDirection: 'column', display: debug ? 'flex' : 'none' }}>
            <C.JSONTree data={Route.params} />
          </C.CardItem>

          <C.CardItem style={{ justifyContent: 'center' }}>
            <C.Ionicon size={48} name="cog-outline" />
          </C.CardItem>

          <C.CardItem style={{ justifyContent: 'center' }}>
            <C.Text size="large" style={{ textAlign: 'center', display: isDone() ? 'flex' : 'none' }}>
              Your news feed preferences have been saved!
            </C.Text>
            <C.Text size="large" style={{ textAlign: 'center', display: isDone() ? 'none' : 'flex' }}>
              Saving your news feed preferences...
            </C.Text>
          </C.CardItem>

          <C.CardItem style={{ justifyContent: 'center' }}>
            <C.Pressable>
              <C.Text size="small" style={{ textAlign: 'center' }}>
                You can come back at any time to edit them.
              </C.Text>
            </C.Pressable>
          </C.CardItem>

          <C.CardItem style={{ justifyContent: 'center' }}>
            <C.Button disabled={!isDone()} block style={{ flex: 1 }} onPress={handle_goToFeed}>
              <C.Text>Go to News Feed</C.Text>
            </C.Button>
          </C.CardItem>
        </C.Card>
      </C.Content>
    </C.Container>
  );
};
