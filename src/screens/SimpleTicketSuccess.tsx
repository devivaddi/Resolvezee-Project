import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';


type SimpleTicketSuccessProps = NativeStackScreenProps<RootStackParamList, 'SimpleTicketSuccess'>;

const SimpleTicketSuccess: React.FC<SimpleTicketSuccessProps> = ({ route, navigation }) => {
  const { incidentName, subcategory, ticketId } = route.params;

  const redirectRef = useRef<any>(null);

 

  useEffect(() => {
    redirectRef.current = setTimeout(() => {
      navigation.navigate('Home');
    }, 6000);
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* <View style={styles.appBar}>
        <TouchableOpacity style={styles.appBarBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1f2937" />
          <Text style={styles.appBarTitle}>Ticket screen</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={50} color="#e9f8f3ff" />
          </View>

          <View style={styles.successPill}>
            <Text style={styles.successTitle}>Ticket Successfully Created</Text>
            <Text style={styles.successSubtitle}>
              Your safety concern has been logged and assigned to our team.
            </Text>
          </View>

          <View style={styles.ticketCard}>
            <View style={styles.ticketRow}>
              <Ionicons name="ticket-outline" size={18} color="#1c5b85ff" />
              <Text style={styles.ticketIdText}>{ticketId}</Text>
            </View>
            <Text style={styles.incidentTitle}>{incidentName}</Text>
            <Text style={styles.subtle}>{subcategory}</Text>
            <Text style={styles.summary}>{`${incidentName}  -  ${subcategory}`}</Text>
          </View>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  appBarBack: { flexDirection: 'row', alignItems: 'center' },
  appBarTitle: { marginLeft: 8, fontSize: 16, color: '#111827', fontWeight: '600' },

  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  card: {
    width: '60%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#008f4cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successPill: {
    marginTop: 16,
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '90%',
  },
  successTitle: { fontSize: 18, fontWeight: '700', color: '#059669', textAlign: 'center' },
  successSubtitle: { marginTop: 4, fontSize: 12, color: '#047857', textAlign: 'center' },

  ticketCard: {
    marginTop: 18,
    backgroundColor: '#eef6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cfe0ff',
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ticketRow: { flexDirection: 'row', alignItems: 'center' },
  ticketIdText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#1f2937' },
  incidentTitle: { marginTop: 10, fontSize: 18, fontWeight: '700', color: '#111827' },
  subtle: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  summary: { marginTop: 10, fontSize: 13, color: '#111827', fontWeight: '500' },
  shareButton: {
    marginTop: 16,
    backgroundColor: '#25D366',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '90%',
    alignItems: 'center',
  },
  shareButtonText: { color: '#ffffff', fontWeight: '700' },
});

export default SimpleTicketSuccess;