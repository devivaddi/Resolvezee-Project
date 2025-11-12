// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// const SimpleTicketSuccess = ({ route, navigation }) => {
//   const { ticketId, subcategory } = route.params || {};

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.successIcon}>✅</Text>
//         <Text style={styles.title}>Ticket Created Successfully!</Text>
//         <Text style={styles.info}>Ticket ID: <Text style={styles.bold}>{ticketId}</Text></Text>
//         <Text style={styles.info}>Type: <Text style={styles.bold}>{subcategory}</Text></Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Text style={styles.buttonText}>Back to Home</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 32,
//     alignItems: 'center',
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     minWidth: 320,
//   },
//   successIcon: { fontSize: 54, marginBottom: 12 },
//   title: { fontSize: 22, fontWeight: 'bold', color: '#16a34a', marginBottom: 10, textAlign: 'center' },
//   info: { fontSize: 16, color: '#374151', marginBottom: 4, textAlign: 'center' },
//   bold: { fontWeight: 'bold', color: '#1c5b85ff' },
//   button: {
//     marginTop: 18,
//     backgroundColor: '#1c5b85ff',
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 28,
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });

// export default SimpleTicketSuccess;