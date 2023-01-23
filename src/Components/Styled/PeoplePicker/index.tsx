import * as React from 'react';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';

// : Hooks
import H from './../../../Hooks';

// : Components
import C from './../../../Components';

export interface iProps {
  setState: (newValue: ISiteUserInfo | undefined) => void;
}

export const PeoplePicker: React.FC<iProps> = (props) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'PeoplePicker.tsx' });
  const logPress = H.Logs.useLog_userPress({ source: 'PeoplePicker.tsx' });
  const [queryInput, setQueryInput] = React.useState<{ queryInput: string }>({ queryInput: '' });
  const lookupUser = H.Queries.useQuery_LookupUser(queryInput);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<ISiteUserInfo | undefined>();

  React.useEffect(() => {
    watchQueryState();
  }, [lookupUser.isFetching]);

  const watchQueryState = () => {
    lookupUser.isFetching ? setIsSearching(true) : setIsSearching(false);
  };

  const handle_SelectPerson = (input: ISiteUserInfo | undefined) => {
    if (input)
      log('People Picker Selection', `User Picked another user in the People Picker, Selected User: ${input?.Id}`, {
        id: '1612801906',
        analytics: { name: 'PeoplePicker_PickedUser', stripExtraData: false },
      });
    if (!input)
      log('People Picker Selection Cleared', 'User cleared the People Picker', {
        id: '1612802436',
        analytics: { name: 'PeoplePicker_Cleared', stripExtraData: false },
      });
    setSelectedPerson(input);
    props.setState(input);
    setIsModalOpen(false);
  };

  const handle_Search = () => {
    log('People Picker Search', `Searching for user based on input '${searchValue}'`, { id: '1612801736' });
    logPress('PeoplePicker_Search', '1631041154', 'btn', [tags.userInteraction]);
    setQueryInput({ queryInput: searchValue });
  };

  const Render_User = (props: { item: ISiteUserInfo; clickAction: () => void }) => {
    const { item, clickAction } = props;
    return (
      <C.Pressable onPress={clickAction}>
        <C.Card>
          <C.CardItem>
            <C.View style={{ flexDirection: 'row' }}>
              <C.View
                style={{
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  overflow: 'hidden',
                }}>
                <C.ProfilePicture userPrincipalName={item.UserPrincipalName ? item.UserPrincipalName : undefined} />
              </C.View>
              <C.View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <C.Text style={{ fontWeight: '400' }}>{item.Title}</C.Text>
                <C.Text style={{ fontSize: 10, color: 'grey' }}>{item.Email}</C.Text>
                <C.Text style={{ fontSize: 10, color: 'grey' }}>{item.UserPrincipalName || ''}</C.Text>
              </C.View>
            </C.View>
          </C.CardItem>
        </C.Card>
      </C.Pressable>
    );
  };

  const Render_Modal = () => {
    return (
      <>
        <C.Modal animationType="slide" visible={isModalOpen}>
          <C.Header searchBar>
            <C.View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingHorizontal: 15 }}>
              <C.Item style={{ paddingTop: 0, flex: 1 }} fixedLabel>
                <C.Label style={{ flex: 0 }}>To: </C.Label>
                <C.Input
                  style={{ flex: 1 }}
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.nativeEvent.text)}
                  placeholder="Last Name, First Name"
                />
              </C.Item>
              <C.View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <C.Button onPress={handle_Search} style={{ borderWidth: 0 }} disabled={isSearching} transparent>
                  <C.Icon style={{ justifyContent: 'center' }} name="search" />
                </C.Button>
              </C.View>
              <C.View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <C.Button onPress={() => setIsModalOpen(false)} style={{ borderWidth: 0 }} disabled={isSearching} transparent>
                  <C.Icon style={{ justifyContent: 'center' }} name="close" />
                </C.Button>
              </C.View>
            </C.View>
          </C.Header>
          <C.Spinner style={{ display: isSearching ? 'flex' : 'none' }} color="grey" />
          <C.View style={{ flex: 1, marginHorizontal: 15 }}>
            <C.FlatList
              keyboardShouldPersistTaps="always"
              style={{ borderWidth: 0 }}
              data={lookupUser.data}
              keyExtractor={(itm) => itm.Id + itm.Title}
              renderItem={(data) => (
                <Render_User
                  item={data.item}
                  clickAction={() => {
                    handle_SelectPerson(data.item);
                  }}
                />
              )}
            />
          </C.View>
          <C.Footer style={{ flexDirection: 'column' }}>
            <C.Text style={{ alignSelf: 'center', fontSize: 12 }}>Selecting a user will dismiss this popup</C.Text>
            <C.Text style={{ alignSelf: 'center', fontSize: 12 }}>Input of 3 or more characters required for query</C.Text>
          </C.Footer>
        </C.Modal>
      </>
    );
  };

  const Render_SelectedUser = () => {
    return !selectedPerson ? (
      <></>
    ) : (
      <>
        <C.View style={{ flexDirection: 'row', alignItems: 'stretch', marginHorizontal: 15, display: selectedPerson ? 'flex' : 'none' }}>
          <C.View style={{ flexDirection: 'column', flexGrow: 1, flexShrink: 1, overflow: 'scroll' }}>
            <Render_User item={selectedPerson} clickAction={() => setSelectedPerson(undefined)} />
          </C.View>
          <C.Card style={{ justifyContent: 'center', overflow: 'hidden', alignContent: 'center', backgroundColor: 'firebrick' }}>
            <C.Pressable
              onPress={() => {
                handle_SelectPerson(undefined);
              }}
              style={{ paddingTop: 0, paddingBottom: 0 }}>
              <C.Icon name="close" style={{ color: 'white' }} />
            </C.Pressable>
          </C.Card>
        </C.View>
      </>
    );
  };

  return (
    <C.View style={{ paddingLeft: 0, flex: 0 }}>
      <C.Pressable onPress={() => setIsModalOpen(true)}>
        <C.View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingHorizontal: 15 }}>
          <C.Item style={{ paddingTop: 0, flex: 1 }} fixedLabel>
            <C.Label style={{ flex: 0 }}>To: </C.Label>
            <C.Input
              style={{ flex: 1 }}
              value={searchValue}
              onTouchStart={() => setIsModalOpen(true)}
              onFocus={() => setIsModalOpen(true)}
              placeholder="Last Name, First Name"
              disabled
            />
          </C.Item>
          <C.View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <C.Button onPress={handle_Search} style={{ borderWidth: 0 }} disabled transparent>
              <C.Icon style={{ justifyContent: 'center' }} name="search" />
            </C.Button>
          </C.View>
        </C.View>
      </C.Pressable>

      {Render_Modal()}
      <Render_SelectedUser />
    </C.View>
  );
};
