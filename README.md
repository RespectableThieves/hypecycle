## HypeCycle Mobile

An opensource react native based Cycling computer

### MVP:
- I should be able to see live data for power, hr, cadence, speed, altitude, and distance on screen [ ]
- Activity:
	- I should be able to start, stop and pause an activity [ ]
	- When an activity is running, Power, hr, cadence, location, altitude, speed, etc should be recorded to the DB [ ]
	- When paused, no data should be written to DB [ ]
	- When stopped a TCX file of the activity should be written to disk [ ]
- sensors:
	- I should be able to list discovered sensors [x]
	- I should be able to pair/connect to a sensor [x]
	- I should be able to disconnect a connected sensor [ ]
	- I should be able to list already paired sensors [x]
	- I should be able to delete already paired sensors [x]
	- The first type of each sensor in DB will be the primary used for data [ ]
- Location:
	- I should be able to see my current location on a map [ ]
	- I should be able to see a track of where I have been [ ]
	- I should be able to re-center the map to where I am [ ]

### TODO:
- Display live data [ ]
	- Write data to "realtimeData" table whenever data is available, populate with empty data at launch. [ ]
	- set up observables on realtimeData table linked to widgets [ ]
- Integrate GPS location data [ ]
	- using https://docs.expo.dev/versions/latest/sdk/location/ , preferably without background task permissions.
- Create active Ride UX:
	- create rides table [ ]
	- Add fab button to start/pause/stop a ride [ ]
	- On start:
		- create entry in rides table with `is_active` == true [ ]
		- set `is_riding` in realTimeTable to true [ ]
	- On Pause:
		- set `is_riding` in realTimeTable to false [ ]
	- On Stop:
		- set `is_riding` in realTimeTable to false [ ]
		- set `is_active` of ride to false [ ]
		- set `stop_time` of ride to current time [ ]
		- set distance, elapsed_time, avgs, etc on ride [ ]
			- depends on data logging tables
		- generate TCX file and save to file system [ ]
			- depends on data logging tables
- Log Data in DB
	- create data logging tables [ ]
	- periodically (INTERVAL seconds) dump a snap shot of realtimeData into hr, pow, cad, loc tables. [ ]
- Add battery to ble lib supported services [ ]
- Mapping:
	- Switch to using Mapbox maps [ ]
		- use route matching API https://github.com/nitaliano/react-native-mapbox-gl/issues/1493
	- Add mapbox navigation page [ ]
		- using https://github.com/homeeondemand/react-native-mapbox-navigation 
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

### **rides** table
A ride should be:
```
*id: alphaNumeric (primary)
*start_at: timestamp / or just use created_at
end_at: timestamp
*is_active: boolean
```

### settings table
A settings table to persist settings and config
```
*id: alphaNumeric (primary)
screen_brightness: number
is_auto_uploading: bool
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
- View real-time data of all friends in your group ride 
    - friends get auto-added by those you follow on strava
- Send notifications for group ride friends to gather at a specific point or if you have a flat.
- incident detection
	- record in a 1-minute buffer and save video if an incident happens
