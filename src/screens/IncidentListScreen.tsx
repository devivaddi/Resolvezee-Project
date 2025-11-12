import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

type Ticket = {
  id: string;
  category: string;
  status: string;
};

const IncidentList: React.FC = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Replace with actual API call to fetch tickets
    const fetchedTickets: Ticket[] = [
      { id: 'TKT-001', category: 'Dust Explosions', status: 'In Progress' },
      { id: 'TKT-002', category: 'Machinery Accidents', status: 'Resolved' },
      { id: 'TKT-003', category: 'Overexertion', status: 'In Progress' },
      { id: 'TKT-004', category: 'Chemical Spills', status: 'Resolved' },
    ];
    setTickets(fetchedTickets);
  }, []);

  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved');
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'In Progress');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.header}>Incident Tracker</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={[styles.statCard, styles.statTotal]}>
          <Text style={styles.statNumber}>{totalTickets}</Text>
          <Text style={styles.statLabel}>Total Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.statCard, styles.statInProgress]}>
          <Text style={styles.statNumber}>{inProgressTickets.length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.statCard, styles.statResolved]}>
          <Text style={styles.statNumber}>{resolvedTickets.length}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </TouchableOpacity>
      </View>

      {/* Tickets List */}
      <Text style={styles.listHeader}>All Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.ticketRow}>
            <Text style={styles.ticketId}>{item.id}</Text>
            <Text style={styles.ticketTitle}>{item.category}</Text>
            <Text
              style={[
                styles.ticketStatus,
                item.status === 'Resolved' ? styles.resolvedStatus : styles.inProgressStatus,
              ]}
            >
              {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tickets found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  statTotal: {
    backgroundColor: '#60a5fa',
  },
  statInProgress: {
    backgroundColor: '#f87171',
  },
  statResolved: {
    backgroundColor: '#34d399',
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#334155',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketId: {
    fontWeight: 'bold',
    color: '#64748b',
    width: 80,
  },
  ticketTitle: {
    flex: 1,
    color: '#334155',
  },
  ticketStatus: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  resolvedStatus: {
    color: '#34d399',
  },
  inProgressStatus: {
    color: '#f87171',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 32,
  },
});

export default IncidentList;