import React from 'react';
import { Container, Row, Col } from 'react-native-flex-grid';
import { SimpleMetric } from '../SimpleMetric';

const GUTTER = 1;

type Widget = {
    title: string;
    data: number;
    icon: string;
  }

type Props = {
  widgetArray: Widget[];
}

export function WidgetGrid({ widgetArray }: Props) {
    
  return (
    <Container fluid noPadding>
    <Row gx={GUTTER}>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Power '} data={301} icon={'lightning-bolt'}></SimpleMetric>
      </Col>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Distance '} data={102.6} icon={'map-marker-distance'}></SimpleMetric>
      </Col>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Cadence '} data={87} icon={'unicycle'}></SimpleMetric>
      </Col>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Temp '} data={27} icon={'temperature-celsius'}></SimpleMetric>
      </Col>
    </Row>
    <Row gx={GUTTER}>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Speed '} data={28.9} icon={'speedometer'}></SimpleMetric>
      </Col>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Heart Rate '} data={172} icon={'heart'}></SimpleMetric>
      </Col>
    </Row>
    <Row gx={GUTTER}>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Elevation '} data={768} icon={'image-filter-hdr'}></SimpleMetric>
      </Col>
      <Col gx={GUTTER}>
        <SimpleMetric title={'NP '} data={201} icon={'lightning-bolt'}></SimpleMetric>
      </Col>
      <Col gx={GUTTER}>
        <SimpleMetric title={'Avg. Speed '} data={25.8} icon={'speedometer'}></SimpleMetric>
      </Col>
    </Row>
  </Container>
  );
}