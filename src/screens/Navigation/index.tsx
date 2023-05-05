import { Container, Row, Col } from 'react-native-flex-grid';
import { SimpleMetric } from '../../components/SimpleMetric';
import MapFollowLocation from '../../components/MapFollowLocation';
import MapRoute from '../../components/MapRoute';
import withObservables from '@nozbe/with-observables';
import Constants from '../../constants';
import { db, RealtimeDataModel } from '../../database';

const GUTTER = 1;

const NavigationView = ({ realtimeData }: { realtimeData: RealtimeDataModel }) => {
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
          {realtimeData.ride?.id ? (
            <MapRoute rideId={realtimeData.ride.id} />
          ) : (
            <MapFollowLocation />
          )}
        </Col>
      </Row>
    </Container>
  );
};

const enhance = withObservables([], () => ({
  realtimeData: db
    .get<RealtimeDataModel>('realtime_data')
    .findAndObserve(Constants.realtimeDataId),
}));

export default enhance(NavigationView);
