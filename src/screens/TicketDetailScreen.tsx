import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getTicketFromHierarchy, updateTicketByPath } from '../services/ticketService';


type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

const TOTAL_SLA_SECONDS = 4 * 60 * 60; // 4 hours

const TicketDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categoryTitle, subcategoryName, ticketId } = route.params;
  const [ticket, setTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_SLA_SECONDS);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let timer: any = null;

    const loadTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketFromHierarchy(categoryTitle, subcategoryName, ticketId);
        setTicket(data);
      } catch (e) {
        console.log('Failed to fetch ticket detail', e);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();

    timer = setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [categoryTitle, subcategoryName, ticketId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpdateStatus = async (status: 'assigned' | 'closed') => {
    try {
      setUpdating(true);
      await updateTicketByPath(categoryTitle, subcategoryName, ticketId, { status });
      setTicket((prev: any) => (prev ? { ...prev, status } : prev));
    } catch (e) {
      console.log('Failed to update ticket status', e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading ticket details...</Text>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Ticket not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={20} color="#2563eb" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isResolved = String(ticket.status || '').toLowerCase() === 'resolved';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.header}>Ticket Tracking</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Ticket ID</Text>
        <Text style={styles.ticketId}>{ticketId}</Text>

        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{categoryTitle}</Text>

        <Text style={styles.label}>Subcategory</Text>
        <Text style={styles.value}>{subcategoryName}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.status, isResolved ? styles.statusResolved : styles.statusOpen]}>
          {ticket.status || 'open'}
        </Text>

        <Text style={styles.label}>SLA Time Remaining</Text>
        <Text style={styles.slaTime}>{formatTime(timeRemaining)}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          disabled={updating}
          onPress={() => handleUpdateStatus('assigned')}
        >
          <Text style={styles.actionText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          disabled={updating}
          onPress={() => handleUpdateStatus('closed')}
        >
          <Text style={styles.actionText}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    color: '#2563eb',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
  },
  ticketId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  value: {
    fontSize: 15,
    color: '#111827',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusOpen: {
    color: '#f97316',
  },
  statusResolved: {
    color: '#22c55e',
  },
  slaTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default TicketDetailScreen;
