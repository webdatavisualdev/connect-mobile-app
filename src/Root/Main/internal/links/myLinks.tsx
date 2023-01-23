import * as React from 'react';

// : Hooks
import H, { Routes, iReduxState, AllActions } from '../../../../Hooks';

// : Components
import C from '../../../../Components';

// : Misc
import M, { iMyLinks } from '../../../../Misc';
import { DragEndParams } from 'react-native-draggable-flatlist';
import { Alert, RefreshControl, StyleSheet } from 'react-native';

export const MyLinks: React.FC = () => {
  const [debug, log, warn, errorLog, tags, titles, legacyLog] = H.Logs.useLog({ source: 'myLinks.tsx' });
  const dispatch = H.NPM.redux.useDispatch();
  const logPress = H.Logs.useLog_userPress({ source: 'myLinks.tsx' });
  const logPullToRefresh = H.Logs.useLog_PullToRefresh({ source: 'myLinks.tsx' });
  const nav = H.NPM.navigation.useNavigation();
  const { params } = H.NPM.navigation.useRoute<any>(); // Any is not ideal, but I cannot figure out React Navigation's use of typings...
  const session = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const isFocused = H.Misc.useScreenMount(Routes.linksMyLinks, { title: 'My Links' });
  const [MyLinksMutation, {}] = H.Queries.useMutation_MyLinks();
  const MyLinksQuery = H.Queries.useQuery_MyLinks();
  const [MyLinks, setMyLinks] = React.useState<iMyLinks[]>([]);
  const [edit, setEdit] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalFields, setModalFields] = React.useState<Partial<iMyLinks>>({});
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [refreshing, setRefreshing] = React.useState(false);

  const Experiment_ShowUrl = H.DEV.useExperiment<boolean>({
    category: 'MyLinks',
    key: 'MyLinksShowUrl',
    name: 'Display URL in My Links',
    description: 'This toggle will display the url under the title of each MyLinks Record',
    setting: false,
    defaultSetting: false,
  });

  const urlColor = H.DEV.useExperiment<string>({
    category: 'MyLinks',
    key: 'MyLinksUrlColor',
    name: 'URL Color in MyLinks',
    description:
      'This value will set the color for the url in my link, this is dependant on displaying the URL and this is simply for sample purposes of the string value',
    setting: 'grey',
    defaultSetting: 'grey',
  });

  React.useEffect(() => {
    dispatch(AllActions.Main.showLinkEditReducer({ value: isFocused }));
  }, [isFocused]);

  React.useEffect(() => {
    if (params && params.edit !== undefined) {
      setEdit(params.edit);

      if (session && params.edit === false) {
        MyLinksMutation({ NewMyLinks: { links: MyLinks }, recordId: MyLinksQuery.data?.ID });
      }
    }
  }, [params, session]);

  const handle_OpenMyLink = (link: string, title: string) => {
    logPress(`Open_My_Link`, '1613425904', 'btn', [tags.navigate]);
    nav.navigate(Routes.webview, { url: link, title });
  };

  const handle_onDragEnd = (newOrder: DragEndParams<iMyLinks>): void => {
    logPress('User_Press_End_on_Reordering_MyLinks', '1613426704', 'btn');
    setMyLinks(newOrder.data);
  };

  const handle_EditMyLink = (index?: number) => {
    if (index !== undefined) {
      logPress(`Edit_My_Link`, '1613425975', 'btn');
      setSelectedIndex(index);
      setModalFields(MyLinks[index]);
      setModalOpen(true);
    }
  };

  const handle_UpdateMyLinks = () => {
    log('User Updating My Links', 'User has Finalized Updating their My Links', {
      id: '1613426293',
      tags: [tags.analyticsEvent],
      extraData: {
        selectedIndex,
        oldLinks: MyLinksQuery.data?.MyLinks.links,
        newLinks: MyLinks,
      },
      analytics: { name: 'update_MyLinks', stripExtraData: true },
    });
    if (selectedIndex > -1) {
      // Existing Link, we need to update a current value
      const newMyLinks = [...MyLinks];
      newMyLinks[selectedIndex] = { ...newMyLinks[selectedIndex], ...modalFields };
      setMyLinks(newMyLinks);
    } else {
      // index is -1, this is a new value, lets append it to MyLinks
      const newMyLinks = [...MyLinks];
      const newLink: iMyLinks = { ...defaultLinkValues, ...modalFields };
      newMyLinks.unshift(newLink);
      setMyLinks(newMyLinks);
    }
    setModalOpen(false);
  };

  const handle_CancelModal = () => {
    logPress('Close_Modal', '1613426969', 'btn');
    setModalFields({});
    setSelectedIndex(-1);
    setModalOpen(false);
  };

  const handle_AddMyLink = () => {
    logPress(`Adding_a_My_Link`, '1613426603', 'btn');
    setSelectedIndex(-1);
    setModalFields({});
    setModalOpen(true);
  };

  const handle_DeleteMyLink = (index?: number, confirmedDelete?: boolean) => {
    logPress(`Delete_My_Link_Confirmation_${confirmedDelete ? 'yes' : 'no'}`, '1613426900', 'dialog');
    if (index !== undefined && (confirmedDelete === false || confirmedDelete === undefined)) {
      Alert.alert('Delete Link?', `Are you sure you want to delete your MyLink called ${MyLinks[index].displayName}`, [
        { text: 'Confirm Delete', style: 'destructive', onPress: () => handle_DeleteMyLink(index, true) },
        { text: 'Cancel Delete', style: 'cancel' },
      ]);
    }
    if (index !== undefined && confirmedDelete) {
      const newMyLinks = [...MyLinks];
      newMyLinks.splice(index, 1);
      setMyLinks(newMyLinks);
    }
  };

  const handle_Refresh = async () => {
    logPullToRefresh('My_Links', '1613423202');
    setRefreshing(true);
    await MyLinksQuery.refetch();
    setRefreshing(false);
  };

  const RenderLink = (props: iMyLinks) => {
    return (
      <C.Pressable onPress={() => handle_OpenMyLink(props.link, props.displayName)}>
        <C.Card transparent>
          <C.CardItem style={styles.ListItem}>
            <C.View style={styles.TextWrapLink}>
              <C.Text style={styles.TextBase}>{props.displayName}</C.Text>
              <C.Text
                numberOfLines={1}
                style={[styles.TextLink, { color: urlColor?.setting ? urlColor.setting : 'grey', display: Experiment_ShowUrl?.setting ? 'flex' : 'none' }]}>
                {props.link}
              </C.Text>
            </C.View>
            <C.Icon name="chevron-forward-outline" />
          </C.CardItem>
        </C.Card>
      </C.Pressable>
    );
  };

  const RenderLinkEditMode = (props: iMyLinks & { drag: () => void; index: number | undefined }) => {
    const [debug, log, warn, errorLog, tags, titles, legacyLog] = H.Logs.useLog({ source: 'myLinks.tsx:RenderLinkEditMode' });
    const logPress = H.Logs.useLog_userPress({ source: 'myLinks.tsx:RenderLinkEditMode' });
    return (
      <>
        <C.Card transparent>
          <C.CardItem style={styles.ListItem}>
            <C.Pressable
              onTouchStart={() => {
                logPress('My_Links_Drag_List_Item_Started', '1613427120', 'btn', [tags.gesture]);
                props.drag();
              }}>
              <C.Icon style={styles.DragItemIcon} name="menu-outline" />
            </C.Pressable>
            <C.View style={styles.TextWrapLinkEditMode}>
              <C.Text style={styles.TextBase}>{props.displayName}</C.Text>
              <C.Text
                numberOfLines={1}
                style={[styles.TextLink, { color: urlColor?.setting ? urlColor.setting : 'grey', display: Experiment_ShowUrl?.setting ? 'flex' : 'none' }]}>
                {props.link}
              </C.Text>
            </C.View>
            <C.Pressable onPress={() => handle_EditMyLink(props.index)}>
              <C.Icon style={styles.Icon} name="pencil-sharp" />
            </C.Pressable>
            <C.Pressable onPress={() => handle_DeleteMyLink(props.index)}>
              <C.Icon style={styles.Icon} name="trash-outline" />
            </C.Pressable>
          </C.CardItem>
        </C.Card>
      </>
    );
  };

  const RenderAddNew = () => {
    return (
      <C.View style={styles.AddNewWrap}>
        <C.Button style={styles.ListItem} block onPress={handle_AddMyLink}>
          <C.Icon style={styles.AddNewIcon} name="add-circle-outline" />
        </C.Button>
      </C.View>
    );
  };

  React.useEffect(() => {
    if (MyLinksQuery.data?.MyLinks) {
      setMyLinks(MyLinksQuery.data.MyLinks.links);
    }
  }, [MyLinksQuery.data]);

  const RenderMyLinkList = () => {
    return (
      <>
        <C.FlatList
          keyExtractor={(i) => `MyLinksLink-${i.displayName}_${i.link}`}
          contentContainerStyle={styles.ListStyle}
          renderItem={(i) => <RenderLink {...i.item} />}
          data={MyLinks}
          refreshing={refreshing}
          onRefresh={handle_Refresh}
        />
      </>
    );
  };

  const RenderMyLinkListEditMode = () => {
    return (
      <>
        <C.DraggableList
          ListHeaderComponent={RenderAddNew}
          keyExtractor={(i) => `MyLinksLink-${i.displayName}_${i.link}`}
          contentContainerStyle={styles.ListStyle}
          renderItem={(i) => <RenderLinkEditMode index={i.index} {...i.item} drag={i.drag} />}
          data={MyLinks}
          onDragEnd={handle_onDragEnd}
          refreshControl={<RefreshControl tintColor={''} onRefresh={handle_Refresh} refreshing={refreshing} />}
        />
      </>
    );
  };

  return (
    <C.Container style={styles.Container}>
      {edit ? <RenderMyLinkListEditMode /> : <RenderMyLinkList />}

      <C.Modal visible={modalOpen} animationType={'slide'}>
        <C.Header style={{ backgroundColor: M.Colors.veniceBlue }}>
          <C.Left style={{ flex: 1 }} />
          <C.Body style={{ flex: 2 }}>
            <C.Text style={{ color: M.Colors.white }}>{selectedIndex === -1 ? 'Edit' : 'Add'} My Link</C.Text>
          </C.Body>
          <C.Right style={{ flex: 1 }}>
            <C.Button onPress={handle_CancelModal} style={{ borderWidth: 0 }} transparent>
              <C.Icon style={{ justifyContent: 'center', color: M.Colors.white }} name="close" />
            </C.Button>
          </C.Right>
        </C.Header>

        <C.ScrollView>
          <C.Form>
            <C.Item style={{ marginHorizontal: 15 }} stackedLabel>
              <C.Label>Link Description</C.Label>
              <C.Input
                value={modalFields.displayName}
                onChange={(e) => setModalFields({ ...modalFields, displayName: e.nativeEvent.text })}
                placeholderTextColor="lightgrey"
                placeholder="AdventHealth Connect Website"
              />
            </C.Item>

            <C.Item style={{ marginHorizontal: 15 }} stackedLabel>
              <C.Label>Link Url</C.Label>
              <C.Input
                keyboardType="url"
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="off"
                value={M.Tools.getCorrectLink(modalFields.link)}
                onChange={(e) => setModalFields({ ...modalFields, link: M.Tools.getCorrectLink(e.nativeEvent.text) })}
                placeholderTextColor="lightgrey"
                placeholder="https://ahsonline.sharepoint.com"
              />
            </C.Item>

            <C.ListItem style={{ marginHorizontal: 15 }}>
              <C.Switch
                onValueChange={() => setModalFields({ ...modalFields, OpenInNewWindow: !modalFields.OpenInNewWindow })}
                value={modalFields.OpenInNewWindow}
              />
              <C.Body style={{ paddingLeft: 15 }}>
                <C.Text>Open in New Tab</C.Text>
                <C.Text style={{ color: 'grey', fontSize: 10 }}>
                  Please Note: New Tabs are not supported on the Mobile; but this toggle will have an effect on Desktop
                </C.Text>
              </C.Body>
            </C.ListItem>
          </C.Form>

          <C.View style={{ padding: 15 }}>
            <C.Button block disabled={modalFields.displayName && modalFields.link ? false : true} onPress={handle_UpdateMyLinks}>
              <C.Text style={{ color: 'white' }}>Save Updated Link</C.Text>
            </C.Button>
          </C.View>

          <C.View style={{ padding: 15, paddingTop: 0 }}>
            <C.Button block danger onPress={handle_CancelModal}>
              <C.Text style={{ color: 'white' }}>Cancel</C.Text>
            </C.Button>
          </C.View>
        </C.ScrollView>

        <C.Footer />
      </C.Modal>
    </C.Container>
  );
};

const defaultLinkValues: iMyLinks = {
  displayName: 'AdventHealth Connect (Default Value)',
  link: 'https://ahsonline.sharepoint.com',
  OpenInNewWindow: false,
  mobileCompatible: true,
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: M.Colors.wildSand,
  },
  ListStyle: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  ListItem: {
    marginBottom: 7,
    backgroundColor: M.Colors.white,
    borderRadius: 5,
    shadowColor: M.Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  TextBase: {
    fontSize: 16,
  },
  TextLink: {
    fontSize: 10,
  },
  TextWrapLink: {
    flex: 1,
    width: 280,
    paddingLeft: 15,
  },
  TextWrapLinkEditMode: {
    flex: 1,
    width: 260,
  },
  DragItemIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  Icon: {
    fontSize: 20,
  },
  AddNewWrap: {
    paddingVertical: 5,
    paddingHorizontal: 1,
  },
  AddNewIcon: {
    color: M.Colors.black,
  },
});
