## HypeCycle Mobile

An opensource react native based Cycling computer

### MVP:
- I should be able to see live data for power, hr, cadence, speed, altitude, and distance on screen [ ]
- Activity:
	- I should be able to start, stop and pause an activity [ ]
	- When an activity is running, Power, hr, cadence, location, altitude, speed, etc should be recorded to the DB [ ]
	- When paused, no data should be written to DB [ ]
	- When stopped a tcx file of the activity should be written to disk [ ]
- sensors:
	- I should be able to list discovered sensors [x]
	- I should be able to pair/connect to a sensor [x]
	- I should be able to disconnect a connected sensor [ ]
	- I should be able to list already paired sensors [x]
	- I should be able to delete already paired sensors [x]
	- The first type of each sensor in DB will be the primary used for data [ ]
- Location:
	- I should be able to see my current location on a map [ ]
	- I should be able to see track of where I have been [ ]
	- I should be able to re-center the map to where I am [ ]

### TODO:
- Display live data [ ]
	- Write data to "realtimeData" table whenever data is available, and populate with empty data at launch [ ]
	- periodically (INTERVAL seconds) dump a snapshot of realtimeData into hr, pow, cad, loc tables [ ]
	- set up observables on realtimeData table linked to widgets [ ]
- add battery to ble lib supported services
- Mapping:
	- Switch to using Mapbox maps [ ]
	- Add Mapbox navigation page [ ]
	- Add functionality for storing offline map packs [ ]

### To Try:
- switch to https://wix.github.io/react-native-ui-lib/docs/components/lists/Drawer for ui components. Would be nice to have swipeable bluetooth sensor list items

## Data Structure
### Real Time Data Table 

```
id: alphaNumeric (primary)
distance: number,
elapsedTime: number,
speed: number,
latitude: number,
longitude: number,
altitude: number,
heading: number,
heartRate: number,
instantPower: number,
3sPower: number,
10sPower: number,
cadence: number
```

### Data Logging Tables
##### table: sensors
A sensor should be:
```
*id: string (primary) 
name: string
type: string
is_primary: boolean
sensorType: string[]
created_at: number
battery_level: number
```

##### table: **rides**
A ride should be:
```
*id: alphaNumeric (primary)
*start_at: timestamp / or just use created_at
end_at: timestamp
*is_active: boolean
power_sensor: foreignKey
hr_sensor: foreignKey
cadence_sensor: foreignKey
```

##### table: **location_measurements**
A locationMeasurement should be:
```
*id: alphanumeric (primary)
accuracy: number
altitude: number
altitude_accuracy: number
heading: number
latitude: number
longitude: number
speed: number
ride_id: string (foreignKey)
```

##### table: **heart_rate_measurements**
```
*id: alphanumeric (primary)
beats_per_minute: number
ride_id: string (foreignKey)
```

##### table: **power_measurements**
```
*id: alphanumeric (primary)
instant_power: number
ride_id: string (foreignKey)
```

##### table: **cadence_measurements**
```
*id: alphanumeric (primary)
cadence: number
ride_id: string (foreignKey)
```


### Design Stuff:

Colors: https://coolors.co/93b7be-f1fffa-d5c7bc-785964-454545
wireframes: https://shaunmulligan.proto.io/player/index.cfm?id=a42986ea-e883-490f-a452-5bfb81a6f1fc

### Install and setup stuff:

```
npx install-expo-modules
```


### Future Features:

#### V1:
- Auto upload ride to strava
- Camera recording 
- light service from phone flash
- Navigate to a point (Mapbox Navigation)
- ride a workout from intervals.icu
	- Need to support laps for this
- Customize screens
	- select which data to display
	- move widgets around 
- detect strava segments
	- need a local geofencing algo for this
- climb pro type feature.
- Weather forecast widget

#### V2:
- View realtime data of all friends in your group ride 
	- friends get auto added by those you follow on strava
- Send notifications for group ride friends to gather as specific point or if you have a flat.
- incident detection
	- record in a 1 minute buffer and save video if incident happens