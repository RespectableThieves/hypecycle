import {useStrava} from '../../lib/StravaContext';
import {Button, Text} from 'react-native-paper';
import {Avatar} from 'react-native-paper';
import Container from '../../components/Container';

const Settings = () => {
  const {athlete: currentUser, logout} = useStrava();

  return (
    <Container>
      <Avatar.Image size={24} source={{uri: currentUser?.profile_medium}} />
      <Text testID="settings-user-greeting">Hi {currentUser?.firstname}</Text>
      <Text>This is where the settings will appear</Text>
      <Button
        mode="contained-tonal"
        onPress={async () => {
          await logout();
          console.log('Logged out');
        }}>
        Logout
      </Button>
    </Container>
  );
};

export default Settings;
