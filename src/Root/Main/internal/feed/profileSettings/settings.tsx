import * as React from 'react';

// : Hooks
import H, { Routes, iReduxState } from './../../../../../Hooks';

// : Components
import C from './../../../../../Components';

// : Misc
import M from './../../../../../Misc';

export const Settings: React.FC = () => {
  const logPress = H.Logs.useLog_userPress({ source: 'profileSettings/settings.tsx' });
  const debug = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.visualDebugging);
  const UserProfile = H.Queries.useQuery_UserProfile();
  const nav = H.NPM.navigation.useNavigation();

  const selectedPrimaryLocState = React.useState<string>();
  const selectedSecondaryLocState = React.useState<string[]>([]);
  const selectedTeamState = React.useState<string>();
  const selectedTopicsState = React.useState<string[]>([]);

  const facilityLocations = H.Queries.useQuery_FacilityLocations();
  const feedDepartments = H.Queries.useQuery_FeedDepartments();
  const feedTopics = H.Queries.useQuery_FeedTopics();

  const primaryLocation = UserProfile.data?.Properties['PrimaryLocation'];
  const secondaryLocations = UserProfile.data?.Properties['SecondaryLocations'];
  const teams = UserProfile.data?.Properties['Teams'];
  const userTopics = UserProfile.data?.Properties['UserTopics'];

  React.useEffect(() => {
    if (primaryLocation) {
      selectedPrimaryLocState[1](primaryLocation);
    }
    if (secondaryLocations) {
      selectedSecondaryLocState[1](secondaryLocations.split('|'));
    }
    if (teams) {
      selectedTeamState[1](teams);
    }
    if (userTopics) {
      const selectedTopics = userTopics.split('|');
      selectedTopicsState[1](selectedTopics);
    }
  }, [userTopics]);

  const handle_Suggestion = () => {
    logPress('Feed Settings Suggest Team/Department', '1620838172', 'btn');
    const url = 'https://forms.office.com/Pages/ResponsePage.aspx?id=eGbDaoV3b0e-A7aLQDc0wvAlPjDIkWNJnKuPWqQ6nZBUNTFNTUZLTzlZU0ZKV0FEMlBWR0daM0FXNy4u';
    nav.navigate(Routes.webview, { url, title: 'Submit a topic or department / team' });
  };

  const handle_Save = () => {
    nav.navigate(Routes.feedProfileSettingsSave, {
      primaryLocation: selectedPrimaryLocState[0],
      secondaryLocation: selectedSecondaryLocState[0],
      team: selectedTeamState[0],
      topics: selectedTopicsState[0],
    });
  };

  return (
    <>
      <C.Container>
        <C.Content style={{ padding: 15, backgroundColor: '#f6f6f6' }}>
          <C.Card style={{ justifyContent: 'center', padding: 15 }}>
            <C.CardItem key="message">
              <C.Text size="tiny" style={{ color: 'grey', textAlign: 'center' }}>
                Learn more about other facilities and departments / team by selecting more locations and topics of interest
              </C.Text>
            </C.CardItem>

            <C.CardItem key="debug" style={{ flexDirection: 'column', display: debug ? 'flex' : 'none' }}>
              <C.Text style={{ paddingBottom: 15 }}>{primaryLocation}</C.Text>
              <C.Text style={{ paddingBottom: 15 }}>{secondaryLocations}</C.Text>
              <C.Text style={{ paddingBottom: 15 }}>{teams}</C.Text>
              <C.Text style={{ paddingBottom: 15 }}>{userTopics}</C.Text>
            </C.CardItem>

            <C.CardItem key="Primary">
              <C.AHPicker
                header="Primary Location"
                options={facilityLocations.data ? facilityLocations.data.map((i) => ({ label: i.AHSDisplayName, key: i.Title })) : []}
                selectedState={selectedPrimaryLocState}
                required={true}
              />
            </C.CardItem>

            <C.CardItem key="Secondary">
              <C.AHMultiPicker
                header="More Locations"
                placeholder="Select Additional Locations"
                custom
                showGroupings
                options={
                  facilityLocations.data
                    ? facilityLocations.data.map((i) => ({
                        label: i.AHSDisplayName,
                        key: i.Title,
                        grouping: i.regionTerm,
                      }))
                    : []
                }
                selectedState={selectedSecondaryLocState}
                required={true}
              />
            </C.CardItem>

            <C.CardItem key="Team">
              <C.AHPicker
                header="Department / Team"
                options={feedDepartments.data ? feedDepartments.data.map((i) => ({ label: i.Label, key: i.Label })) : []}
                selectedState={selectedTeamState}
                required={true}
              />
            </C.CardItem>

            <C.CardItem key="Topic">
              <C.AHMultiPicker
                header="Topics"
                options={feedTopics.data ? feedTopics.data.map((i) => ({ label: i.Label, key: i.Label })) : []}
                selectedState={selectedTopicsState}
                placeholder={`${selectedTopicsState[0].length} of ${feedTopics.data?.length}`}
                custom
              />
            </C.CardItem>

            <C.CardItem key="Suggestion">
              <C.View style={{ flex: 1 }}>
                <C.Text style={{ textAlign: 'center', color: M.Colors.veniceBlue }} onPress={handle_Suggestion}>Submit a topic or department / team</C.Text>
              </C.View>
            </C.CardItem>

            <C.CardItem key="Save">
              <C.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <C.View style={{ flex: 1 }} />
                <C.Button style={{ flex: 1 }} onPress={handle_Save}>
                  <C.Text style={{ flex: 1, textAlign: 'center' }}>Save</C.Text>
                </C.Button>
                <C.View style={{ flex: 1 }} />
              </C.View>
            </C.CardItem>
          </C.Card>
        </C.Content>
      </C.Container>
    </>
  );
};
