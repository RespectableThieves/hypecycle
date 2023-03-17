import {Divider, List} from 'react-native-paper';
import styled from 'styled-components/native';

type Props = {
  type: string;
};

export const Container = styled.View<Props>`
  width: 100%;
  height: 50px;

  padding: 12px;
  border-radius: 8px;
  border: 2px solid #93b7be;

  flex-direction: row;
  align-items: center;
  margin-bottom: 2px;
`;

export const Icon = styled.View<Props>`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-right: 12px;
`;

export const Name = styled.Text`
  flex: 1;
  font-size: 14px;
`;

export const Options = styled.View`
  padding: 5px 0;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const Option = styled.TouchableOpacity`
  width: 40px;
  align-items: center;
`;

export const StyledListItem = styled(List.Item)``;

export const VerticalDivider = styled(Divider)`
  width: 2px;
  height: 60%;
  margin-left: 6px;
`;
