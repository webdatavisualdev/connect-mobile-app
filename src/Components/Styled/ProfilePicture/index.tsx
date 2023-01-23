import * as React from 'react';

// : Hooks
import H, { iReduxState } from './../../../Hooks';

// : Components
import C from './../../../Components';

// : Misc
import M from './../../../Misc';

export interface iProps {
  userPrincipalName?: string;
}

export const ProfilePicture: React.FC<iProps> = (props) => {
  const UserProfile = H.Queries.useQuery_UserProfile();
  const hasSession = H.NPM.redux.useSelector((s: iReduxState) => s.Auth.activeSession);
  const [initials, setInitials] = React.useState('');

  React.useEffect(() => {
    if (UserProfile.data) {
      if (UserProfile.data.Properties.FirstName && UserProfile.data.Properties.LastName) {
        setInitials(UserProfile.data.Properties.FirstName.slice(0,1) + UserProfile.data.Properties.LastName.slice(0,1));
      } else {
        setInitials('no-initials');
      }
    }
  }, [UserProfile.data]);

  if (hasSession) {
    if (UserProfile.data?.PictureUrl) {
      return (
        <C.Image
          style={{ height: '100%', aspectRatio: 1, minHeight: 5, minWidth: 5 }}
          source={{
            uri: `https://ahsonline.sharepoint.com/_layouts/15/userphoto.aspx?size=l&accountname=${
              props.userPrincipalName ? props.userPrincipalName : UserProfile.data.Properties['SPS-UserPrincipalName']
            }`,
          }}
        />
      );
    } else if (initials && initials !== 'no-initials') {
      return (
        <C.View style={{width: 35, height: 35, borderRadius: 50, backgroundColor: '#cfebdf', justifyContent: 'center', alignItems: 'center'}}>
          <C.Text style={{color: M.Colors.veniceBlue, fontWeight: 'bold', fontSize: 15}}>TW</C.Text>
        </C.View>
      )
    } else {
      return <C.Icon name="person" />;
    }
  } else {
    return <C.Spinner size="small" color="grey" />;
  }
};
