import * as React from 'react';

// : Hooks
import H from './../../../../Hooks';

// : Components
import C from './../../../../Components';

export const SelectDash: React.FC = () => {
  const [setAsyncCache, delAsyncCache, getAsyncCache, staticAsyncCache] = H.Misc.useAsyncStorage({ class: 'Dashboard', categories: [] });
  const DashboardKey = 'SelectedDash';
  const [customInput, setCustomInput] = React.useState('');
  const nav = H.NPM.navigation.useNavigation();
  const data = [
    { title: 'Test Landing Page', url: 'https://ahsonline.sharepoint.com/teams/CarversConcoctions/SitePages/Test-Landing-Dashboard.aspx?env=WebView' },
    { title: 'Carvers Concoctions', url: 'https://ahsonline.sharepoint.com/teams/CarversConcoctions?env=WebView' },
    { title: 'Well 65+', url: 'https://ahsonline.sharepoint.com/sites/Well65Plus?env=WebView' },
    { title: 'Viva Learning (Not Working)', url: 'https://client.learningapp.microsoft.com/discoverLearning?theme=default&isFullScreen=true' },
    { title: 'Viva Insights', url: 'https://insights.viva.office.com?env=WebView' },
    { title: 'Viva My Analytics', url: 'https://myanalytics.microsoft.com?env=WebView' },
    { title: 'Delve', url: 'https://nam.delve.office.com?env=WebView' },
    { title: 'Stream', url: 'https://web.microsoftstream.com?env=WebView' },
    { title: 'Outlook', url: 'https://outlook.office.com/mail?env=WebView' },
    {
      title: 'Talent Match for Team Members',
      url:
        'https://apps.powerapps.com/play/bed040bf-25fd-48c6-8933-9b488705842b?tenantId=6ac36678-7785-476f-be03-b68b403734c2&hint=de572b3d-31d6-438c-a2ff-4a0cd251acb4&source=businessAppDiscovery&hideNavBar=true',
    },
  ];

  const handle_SelectDash = (url: string) => {
    setAsyncCache([{ key: DashboardKey, value: url }]);
    nav.goBack();
  };

  const header = (
    <>
      <C.View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}>
        <C.Form>
          <C.Item stackedLabel>
            <C.Text size="tiny">
              Any Modern Sharepoint Site can be used as a custom Dashboard. Simply Copy/Paste the link with HTTPS:// included and click "Set"
            </C.Text>
            <C.Label>Custom URL</C.Label>
            <C.Input
              value={customInput}
              textContentType="URL"
              autoCorrect={false}
              onChange={(e) => setCustomInput(e.nativeEvent.text)}
              placeholderTextColor="lightgrey"
              placeholder="AdventHealth Connect Website"
            />
          </C.Item>
        </C.Form>
        <C.Button
          style={{ marginTop: 5 }}
          onPress={() => {
            handle_SelectDash(customInput);
          }}
          block>
          <C.Text>Set Custom Dashboard</C.Text>
        </C.Button>
      </C.View>
    </>
  );

  return (
    <C.FlatList
      data={data}
      keyExtractor={(i, index) => `${index}.${i.title}`}
      ListHeaderComponent={header}
      renderItem={(i) => (
        <C.Pressable
          onPress={() => {
            handle_SelectDash(i.item.url);
          }}>
          <C.View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}>
            <C.Text>{i.item.title}</C.Text>
          </C.View>
        </C.Pressable>
      )}
    />
  );
};
