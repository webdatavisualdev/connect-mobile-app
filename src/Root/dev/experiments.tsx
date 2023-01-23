import * as React from 'react';

// : Hooks
import H, { Routes, AllActions, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

// : Misc
import { iExperiment } from './../../Misc';

export const Experiments: React.FC = () => {
  const [allExperimentKeys, setAllExperimentsKeys] = React.useState<string[]>([]);
  const experiments = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.experiments);

  React.useEffect(() => {
    setAllExperimentsKeys(Object.keys(experiments));
  }, [JSON.stringify(experiments)]);

  const ListHeader = () => {
    return (
      <>
        <C.Text>After changing any settings here an application restart is required for those changes to take effect.</C.Text>
        <C.Form>
          <C.Item>
            <C.Input placeholder="Category Filter" />
          </C.Item>
        </C.Form>
      </>
    );
  };

  return (
    <C.Container>
      <C.Content>
        <C.FlatList
          ListHeaderComponent={<ListHeader />}
          contentContainerStyle={{ padding: 15 }}
          renderItem={(i) => <RenderExperiment item={i.item} />}
          data={allExperimentKeys}
        />
      </C.Content>
    </C.Container>
  );
};

const RenderExperiment = (props: { item: string }) => {
  const experimentKey = props.item;
  const experiment = H.NPM.redux.useSelector((s: iReduxState) => s.Dev.experiments[experimentKey]);
  const dispatch = H.NPM.redux.useDispatch();
  const setState = (data: iExperiment<any>) => dispatch(AllActions.Dev.toggleExperiment({ key: experimentKey, experiment: data }));
  const [expanded, setExpanded] = React.useState(false);

  if (experiment === undefined || experiment === null)
    return (
      <>
        <C.Spinner color="grey" />
        <C.Text>{JSON.stringify(experiment)}</C.Text>
        <C.Text>{experimentKey}</C.Text>
        <C.JSONTree data={experiment} />
      </>
    );

  let input = <C.Text>Determining Input Type</C.Text>;
  switch (typeof experiment.defaultSetting) {
    case 'boolean':
      input = <C.Switch value={experiment.setting as boolean} onValueChange={(v) => setState({ ...experiment, setting: !experiment.setting })} />;
      break;
    case 'string':
      input = (
        <C.Form>
          <C.Item>
            <C.Input
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={experiment.setting as string}
              onEndEditing={(e) => setState({ ...experiment, setting: e.nativeEvent.text })}
            />
          </C.Item>
        </C.Form>
      );
      break;
    default:
      input = <C.Text>Unknown Input Type</C.Text>;
  }

  return (
    <C.Card style={{ borderRadius: 15, backgroundColor: experiment.setting !== experiment.defaultSetting ? 'greenyellow' : 'ghostwhite' }}>
      <C.Pressable onPress={() => setExpanded(!expanded)}>
        <C.View style={{ padding: 15 }}>
          <C.View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10 }}>
            <C.Text style={{ color: 'grey', fontSize: 12 }}>Category: {experiment.category}</C.Text>
            <C.Text style={{ color: 'grey', fontSize: 12 }}>|</C.Text>
            <C.Text style={{ color: 'grey', fontSize: 12 }}>Default: {experiment.defaultSetting.toString()}</C.Text>
            <C.Text style={{ color: 'grey', fontSize: 12 }}>|</C.Text>
            <C.Text style={{ color: 'grey', fontSize: 12 }}>Current: {experiment.setting.toString()}</C.Text>
          </C.View>
          <C.Text style={{ alignSelf: 'center' }}>{experiment.name}</C.Text>
        </C.View>
      </C.Pressable>

      <C.View style={{ display: expanded ? 'flex' : 'none' }}>
        <C.View style={{ padding: 15 }}>
          <C.Text style={{ fontSize: 12, color: 'grey' }}>{experiment.description}</C.Text>
        </C.View>

        <C.View style={{ padding: 15 }}>
          {input}
          <C.Button transparent block onPress={() => setState({ ...experiment, setting: experiment.defaultSetting })}>
            <C.Text style={{ fontWeight: 'bold' }}>Reset</C.Text>
          </C.Button>
        </C.View>
      </C.View>
    </C.Card>
  );
};
