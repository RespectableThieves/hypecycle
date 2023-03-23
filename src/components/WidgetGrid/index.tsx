import React from 'react';
import {Container, Row, Col} from 'react-native-flex-grid';
import withObservables from '@nozbe/with-observables';
import {SimpleMetric} from '../SimpleMetric';
import {REALTIME_DATA_ID} from '../../constants';
import {db, RealtimeDataModel} from '../../database';

const GUTTER = 1;

type Widget = {
  title: string;
  data: number;
  icon: string;
};

type Props = {
  widgetArray: Widget[];
  realtimeData: RealtimeDataModel;
};

function WidgetGrid({realtimeData}: Props) {
  return (
    <Container fluid noPadding>
      <Row gx={GUTTER}>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Power '}
            data={realtimeData.instantPower}
            icon={'lightning-bolt'}
          />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Distance '}
            data={realtimeData.distance}
            icon={'map-marker-distance'}
          />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Cadence '}
            data={realtimeData.cadence}
            icon={'unicycle'}
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
      <Row gx={GUTTER}>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Speed '}
            data={realtimeData.speed}
            icon={'speedometer'}
          />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Heart Rate '}
            data={realtimeData.heartRate}
            icon={'heart'}
          />
        </Col>
      </Row>
      <Row gx={GUTTER}>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Elevation '}
            data={realtimeData.instantPower}
            icon={'image-filter-hdr'}
          />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric title={'NP '} data={201} icon={'lightning-bolt'} />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Avg. Speed '}
            data={25.8}
            icon={'speedometer'}
          />
        </Col>
      </Row>
    </Container>
  );
}

const enhance = withObservables([], () => ({
  realtimeData: db
    .get<RealtimeDataModel>('realtime_data')
    .findAndObserve(REALTIME_DATA_ID),
}));

export default enhance(WidgetGrid);
