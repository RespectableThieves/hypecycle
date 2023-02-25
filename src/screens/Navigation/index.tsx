import { WidgetGrid } from '../../components/WidgetGrid';
import { Container, Row, Col } from 'react-native-flex-grid';
import { SimpleMetric } from '../../components/SimpleMetric';
import { MapWidget } from '../../components/MapWidget';

const GUTTER = 1;

const NavigationView = () => {

  return (
    <Container fluid noPadding>
      <Row gx={GUTTER}>
        <Col gx={GUTTER}>
          <Row gx={GUTTER}>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Cadence '} data={87} icon={'unicycle'}></SimpleMetric>
            </Col>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Temp '} data={27} icon={'temperature-celsius'}></SimpleMetric>
            </Col>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Cadence '} data={87} icon={'unicycle'}></SimpleMetric>
            </Col>
          </Row>
          <Row gx={GUTTER}>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Speed '} data={27.8} icon={'speedometer'}></SimpleMetric>
            </Col>
          </Row>
          <Row gx={GUTTER}>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Power '} data={301} icon={'lightning-bolt'}></SimpleMetric>
            </Col>
            <Col gx={GUTTER}>
              <SimpleMetric title={'Temp '} data={27} icon={'temperature-celsius'}></SimpleMetric>
            </Col>
          </Row>
        </Col>
        <Col gx={GUTTER}>
          <MapWidget title={'Route '} data={[102.6]}></MapWidget>
        </Col>
      </Row>
    </Container>
  );
}


export default NavigationView;
