import {Text} from 'react-native-paper';
import styled from 'styled-components/native';

type Props = {
  widgetHeight: number;
};

export const CenteredView = styled.View`
  align-items: center;
  border-radius: 5px;
`;

export const OuterView = styled.View<Props>`
  background-color: #454545 
  height: ${({widgetHeight}) => widgetHeight}px;
  margin-bottom: 3px;
  border-radius: 8px;
`;

export const Title = styled(Text)`
  margin-left: 5px;
  color: #93b7be;
`;

export const DataText = styled(Text)`
  color: #f1fffa;
`;
