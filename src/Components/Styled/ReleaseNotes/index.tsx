import * as React from 'react';
import ChangeLog, { iChangeLog, iChange, cat as eCategories, t as Tags } from './../../../../ChangeLog';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';

// : Components
import C from './../../../Components';

export interface iProps {
  // Number of releases to render
  // Defaults to: If Left Blank/Undefined, then all releases will be shown
  releasesToShow?: number;

  // Ignore the "Show" value, meaning all changes will be rendered
  // Defaults to: false
  ignoreShow?: boolean;

  // Filters for specific tags in the Tags enum
  tagFilter?: Tags[];
}

export const ReleaseNotes: React.FC<iProps> = (props) => {
  const [Releases, setReleases] = React.useState<iChangeLog[]>([]);

  React.useEffect(() => {
    if (props.releasesToShow) {
      setReleases(ChangeLog.slice(0, props.releasesToShow));
    } else {
      setReleases(ChangeLog);
    }
  }, []);

  return (
    <>
      <C.View style={{ padding: 15 }}>
        {Releases.map((Release, index) => (
          <RenderRelease key={index} {...Release} />
        ))}
      </C.View>
    </>
  );
};

interface iRenderRelease extends iChangeLog {}

const RenderRelease = (props: iRenderRelease) => {
  const f = 'MM/DD/YYYY';
  const formattedDate = typeof props.Date === 'number' ? moment.unix(props.Date).format(f) : moment(props.Date).format(f);

  const toClipboard = () => {
    let s = `
Title: ${props.Title}
Summary: ${props.Summary}
Date: ${formattedDate}

`;
    const changes = props.Changes.map((c) => {
      const change = `- ${c.Task} by ${c.Developer} [${c.Category}] : ${c.Description} \r\r`;
      s = s + change;
    });
    Clipboard.setString(s);
    C.Alert.alert('Release Notes copied to Clipboard');
  };

  return (
    <C.Pressable onLongPress={toClipboard}>
      <C.Card style={{ marginVertical: 25 }}>
        <C.CardItem style={{ flexDirection: 'column', backgroundColor: '#075080' }} header>
          <C.Text size="large" style={{ fontWeight: 'bold', alignContent: 'center', color: 'white' }}>
            {props.Title}
          </C.Text>
          <C.Text size="tiny" style={{ color: 'white' }}>
            Release: {props.Release.toString()} - {formattedDate}
          </C.Text>
          <C.Text size="tiny" style={{ color: 'white' }}>
            {props.Summary}
          </C.Text>
        </C.CardItem>

        {Object.values(eCategories).map((key) => (
          <C.View style={{ display: props.Changes.filter((i) => i.Category === key).length > 0 ? 'flex' : 'none' }}>
            <C.CardItem style={{ flexDirection: 'column', backgroundColor: '#C1C6C8' }}>
              <C.Text style={{ color: 'white', fontWeight: 'bold' }} size="medium">
                {key}
              </C.Text>
            </C.CardItem>
            {props.Changes.filter((itm) => itm.Category === key).map((change, index) => (
              <RenderChange key={index} {...change} />
            ))}
          </C.View>
        ))}
      </C.Card>
    </C.Pressable>
  );
};

interface iRenderChange extends iChange {}

const RenderChange = (props: iRenderChange) => {
  const f = 'MM/DD/YYYY';
  const formattedDate = typeof props.Date === 'number' ? moment.unix(props.Date).format(f) : moment(props.Date).format(f);

  return (
    <C.ListItem style={{ flexDirection: 'column', alignItems: 'flex-start' }} noIndent>
      <C.Text>
        {formattedDate} - Task: {props.Task || 'N/A'}
      </C.Text>
      <C.Text size="small" style={{ color: 'grey' }}>
        {props.Description}
      </C.Text>
      <C.View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {props.Tags.map((tag, index) => (
          <C.Text
            size="tiny"
            style={{ overflow: 'hidden', borderRadius: 5, backgroundColor: 'blue', color: 'white', fontWeight: '500', padding: 5, margin: 5 }}
            key={index}>
            {tag}
          </C.Text>
        ))}
      </C.View>
    </C.ListItem>
  );
};
