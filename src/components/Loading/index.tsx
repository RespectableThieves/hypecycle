import {ActivityIndicator} from 'react-native-paper';
import {Text} from 'react-native';
import Container from '../Container';

export default () => {
  return (
    <Container>
      <Text>HypeCyle</Text>
      <ActivityIndicator animating={true} />
    </Container>
  );
};
