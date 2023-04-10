import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Container, Row, Col} from 'react-native-flex-grid';
import withObservables from '@nozbe/with-observables';
import {SimpleMetric} from '../SimpleMetric';
import {REALTIME_DATA_ID} from '../../constants';
import {db, RealtimeDataModel} from '../../database';
import {
  getRideAggregates,
  metersToKilometers,
  RideAggregate,
} from '../../lib/data';
import useSetInterval from '../../hooks/useSetInterval';

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

function rounded(data: number | null | undefined) {
  if (data === null || data === undefined) {
    return data;
  }

  return parseFloat(data.toFixed(2));
}

function WidgetGrid({realtimeData}: Props) {
  const [aggregates, setAggregates] = useState<RideAggregate>();

  useSetInterval(
    async () => {
      if (realtimeData.ride) {
        const ride = await realtimeData.ride?.fetch();
        const result = await getRideAggregates(ride);
        setAggregates(result);
      }
    },
    realtimeData.ride?.id ? 10000 : null,
  );

  useEffect(() => {
    if (!realtimeData.ride?.id) {
      setAggregates(undefined);
    }
  }, [realtimeData.ride?.id]);

  return (
    <Container fluid noPadding>
      <Row gx={GUTTER} style={styles.row}>
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
            data={metersToKilometers(realtimeData.distance)} // Maybe this converstion should be so
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
            title={'Avg. Power '}
            data={rounded(aggregates?.avgPower)}
            icon={'lightning-bolt'}
          />
        </Col>
      </Row>
      <Row gx={GUTTER} style={styles.row}>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Speed '}
            data={rounded(realtimeData.speed)}
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
      <Row gx={GUTTER} style={styles.row}>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Elevation '}
            data={rounded(realtimeData.altitude)}
            icon={'image-filter-hdr'}
          />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric title={'Max Power '} data={rounded(aggregates?.maxPower)} icon={'lightning-bolt'} />
        </Col>
        <Col gx={GUTTER}>
          <SimpleMetric
            title={'Avg. Speed '}
            data={rounded(aggregates?.avgSpeed)}
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

const styles = StyleSheet.create({
  row: {
    marginBottom: 5,
  },
});
