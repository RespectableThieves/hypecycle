import {useStrava} from '../../lib/StravaContext';
import {Text} from 'react-native-paper';
import {Avatar} from 'react-native-paper';
import Container from '../../components/Container';
import StravaConnect from '../../components/StravaConnect';
import {Athlete} from '../../lib/strava';
import * as Application from 'expo-application';

const StravaSettings = ({athlete}: {athlete: Athlete}) => {
  return (
    <Container>
      <Avatar.Image size={24} source={{uri: athlete?.profile_medium}} />
      <Text testID="settings-user-greeting">Hi {athlete?.firstname}</Text>
      <Text>This is where the strava settings will appear</Text>
    </Container>
  );
};

const Settings = () => {
  const {athlete} = useStrava();

  return (
    <Container>
      <Text>This is a test!!!</Text>
      <Text>Native build version: {Application.nativeBuildVersion}</Text>
      <StravaConnect />
      {athlete && <StravaSettings athlete={athlete} />}
    </Container>
  );
};

export default Settings;
