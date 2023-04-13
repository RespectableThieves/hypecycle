import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {Container, Empty} from './styles';
import {SensorModel} from '../../database';
import {Button, Text} from 'react-native-paper';
import {getAllSensors, heartRateMonitor, powerMeter} from '../../lib/sensor';
import {Sensor} from '../../components/Sensor';
import {SensorDiscoveryModal} from '../../components/SensorDiscoveryModal';
import {DrawerNavProps} from '../../components/DrawerNav';

const _listEmptyComponent = () => {
  return (
    <Empty>
      <Text variant="titleMedium">
        No Connected Sensors yet... Try add some!
      </Text>
    </Empty>
  );
};

const HeaderRight =
  ({showModal}: {showModal: () => void}) =>
  () =>
    (
      <Button icon="plus-thick" mode="contained" onPress={showModal}>
        Add
      </Button>
    );

export default function Sensors({navigation}: DrawerNavProps) {
  const [sensors, setSensors] = useState<SensorModel[]>([]);
  const [visible, setVisible] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = async () => {
    setVisible(false);
    await fetchData();
  };

  async function fetchData() {
    // Get list paired bluetooth sensors from our DB.
    setRefreshing(true);
    try {
      setRefreshing(true);
      console.log('Fetching paired sensors from DB...');
      const allSensor = await getAllSensors();
      setSensors(allSensor);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemove(item: SensorModel) {
    // Remove the selected sensor and refetch data.
    try {
      await item.deleteSensor();
      console.log({item});
      if (item.sensorType.includes('HeartRate')) {
        console.log('Removing heartRateMonitor');
        await heartRateMonitor.disconnect().catch((err: Error) => {
          console.log(err);
        });
      }
      if (item.sensorType.includes('CyclingPower')) {
        await powerMeter.disconnect().catch((err: Error) => {
          console.log(err);
        });
      }

      await fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: HeaderRight({showModal}),
    });
    fetchData();
  }, [navigation]);

  return (
    <Container>
      <FlatList
        data={sensors}
        keyExtractor={item => item?.id}
        ListEmptyComponent={_listEmptyComponent}
        onRefresh={fetchData}
        refreshing={isRefreshing}
        renderItem={({item}) => (
          <Sensor
            data={item}
            onAction={() => handleRemove(item)}
            actionIcon="trash-can"
            actionColor="#EE3B45"
          />
        )}
      />
      <SensorDiscoveryModal visible={visible} onDismiss={hideModal} />
    </Container>
  );
}
