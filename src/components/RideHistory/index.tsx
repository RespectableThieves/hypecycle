import {
  Text
} from 'react-native'
// import {
//   RideSummaryModel,
//   db
// } from '../../database'
// import withObservables from '@nozbe/with-observables';
// import {
//   View,
//   Text,
//   FlatList
// } from 'react-native'

// function RideSummary({ summaries }) {
//   return (
//     <>
//       <Text>hi</Text>
//       <FlatList<RideSummaryModel>
//         data={summaries}
//         keyExtractor={item => item?.id}
//         renderItem={({ item }) => (
//           <View>
//             <Text>{item.id}</Text>
//           </View>
//         )}
//       />
//     </>
//   )
// }

// const enhance = withObservables([], () => {
//   return {
//     summaries: db.get<RideSummaryModel>('ride_summary').query().observe(),
//   };
// })

// export default enhance(RideSummary)

export default () => {
  return (<Text>hi</Text>)
}
