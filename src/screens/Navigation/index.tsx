import {Container, Row, Col} from 'react-native-flex-grid';
import {SimpleMetric} from '../../components/SimpleMetric';
import {MapWidget} from '../../components/MapWidget';

const GUTTER = 1;

const NavigationView = () => {
  return (
    <Container fluid noPadding>
      <Row gx={GUTTER}>
        <Col gx={GUTTER}>
          <Row gx={GUTTER}>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Cadence '} data={87} icon={'unicycle'} />
            </Col>
            <Col gx={GUTTER}>
              <SimpleMetric
                title={'Temp '}
                data={27}
                icon={'temperature-celsius'}
              />
            </Col>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Cadence '} data={87} icon={'unicycle'} />
            </Col>
          </Row>
          <Row gx={GUTTER}>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Speed '} data={27.8} icon={'speedometer'} />
            </Col>
          </Row>
          <Row gx={GUTTER}>
            <Col gx={GUTTER}>
              <SimpleMetric
                title={'Power '}
                data={301}
                icon={'lightning-bolt'}
              />
            </Col>
            <Col gx={GUTTER}>
              <SimpleMetric
                title={'Temp '}
                data={27}
                icon={'temperature-celsius'}
              />
            </Col>
          </Row>
        </Col>
        <Col gx={GUTTER}>
          <MapWidget title={'Route '} data={[102.6]} />
        </Col>
      </Row>
    </Container>
  );
};

export default NavigationView;
