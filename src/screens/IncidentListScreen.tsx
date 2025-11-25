import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { getTicketsByCategoryAndSubcategory, getAllTickets, getAllTicketsTraverse, getAllTicketsTraverseLegacy } from '../services/ticketService';

type Ticket = {
  id: string;
  category: string;
  status: string;
  subcategory: string;
  date: string;
  time: string;
  locationLabel: string;
  resolverName: string;
  resolvedDate?: string;
};

const IncidentList: React.FC = () => {
  const navigation = useNavigation();
  const { selectedCategory, selectedSubcategory } = useAppSelector(state => state.incident);
  const localTickets = useAppSelector(state => state.ticket.tickets);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const sampleTicketsRef = React.useRef<Ticket[]>([
    {
      id: 'TMC0001',
      category: 'Machinery Accidents',
      status: 'Resolved',
      subcategory: 'Entanglement',
      date: '27/11/2025',
      time: '11:25',
      locationLabel: '17.4500, 78.3800',
      resolverName: 'Resolver Team',
      resolvedDate: '27/11/2025',
    },
    {
      id: 'TMC0002',
      category: 'Fire and Explosion',
      status: 'Resolved',
      subcategory: 'Dust Explosions',
      date: '27/11/2025',
      time: '10:05',
      locationLabel: '17.4501, 78.3804',
      resolverName: 'Ops Team',
      resolvedDate: '27/11/2025',
    },
    {
      id: 'TMC0003',
      category: 'Waste management',
      status: 'Resolved',
      subcategory: 'Unauthorized Discharge',
      date: '25/11/2025',
      time: '13:45',
      locationLabel: '17.4490, 78.3810',
      resolverName: 'Utility Team',
      resolvedDate: '26/11/2025',
    },
    {
      id: 'TMC0004',
      category: 'Material Handling',
      status: 'Pending',
      subcategory: 'Dropped Loads',
      date: '27/11/2025',
      time: '09:12',
      locationLabel: '17.4520, 78.3820',
      resolverName: 'Thallam Manikanta',
      resolvedDate: undefined,
    },
  ]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        let firebaseTickets = (!selectedCategory || !selectedSubcategory)
          ? await getAllTickets()
          : await getTicketsByCategoryAndSubcategory(
              selectedCategory.title,
              selectedSubcategory,
            );
        if ((!selectedCategory || !selectedSubcategory) && (!firebaseTickets || firebaseTickets.length === 0)) {
          // Fallback when collectionGroup is unavailable (index/rules) or returns empty
          firebaseTickets = await getAllTicketsTraverse();
          if (!firebaseTickets || firebaseTickets.length === 0) {
            firebaseTickets = await getAllTicketsTraverseLegacy();
          }
        }

        const mapped: Ticket[] = firebaseTickets.map((t: any) => {

          let date = '';
          let time = '';
          let parsed: Date | null = null;
          if (t.createdAtClient) {
            parsed = new Date(t.createdAtClient);
          } else if (t.createdAt && typeof t.createdAt.toDate === 'function') {
            parsed = t.createdAt.toDate();
          } else if (t.createdAt && typeof t.createdAt._seconds === 'number') {
            parsed = new Date(t.createdAt._seconds * 1000);
          }
          if (parsed && !isNaN(parsed.getTime())) {
            date = parsed.toLocaleDateString();
            time = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          let locationLabel = 'Location not available';
          if (t.location && typeof t.location.latitude === 'number' && typeof t.location.longitude === 'number') {
            locationLabel = `${t.location.latitude.toFixed(4)}, ${t.location.longitude.toFixed(4)}`;
          }

          let resolverLabel = t.assignedTo?.name || 'Not assigned';
          if (!t.assignedTo?.name && t.assignedGroup) {
            const phone = Array.isArray(t.assignedGroupPhones) && t.assignedGroupPhones.length > 0
              ? `  ${t.assignedGroupPhones[0]}`
              : '';
            resolverLabel = `${t.assignedGroup}${phone}`;
          }

          let resolvedDate: string | undefined = undefined;
          if (t.resolvedAt && typeof t.resolvedAt.toDate === 'function') {
            const rd = t.resolvedAt.toDate();
            if (!isNaN(rd.getTime())) resolvedDate = rd.toLocaleDateString();
          } else if (t.resolvedDate) {
            const rd = new Date(t.resolvedDate);
            if (!isNaN(rd.getTime())) resolvedDate = rd.toLocaleDateString();
          }

          return {
            id: t.ticketNumber || t.id,
            category: t.categoryTitle || t.category || (selectedCategory ? selectedCategory.title : 'Unknown'),
            status: t.status || 'open',
            subcategory: t.subcategory || selectedSubcategory || '-',
            date,
            time,
            locationLabel,
            resolverName: resolverLabel,
            resolvedDate,
          };
        });

        if (mapped.length === 0 && (!selectedCategory || !selectedSubcategory) && Array.isArray(localTickets) && localTickets.length > 0) {
          const fallbackMapped: Ticket[] = localTickets.map((lt: any) => {
            let date = '';
            let time = '';
            if (lt.createdAt) {
              const d = new Date(lt.createdAt);
              if (!isNaN(d.getTime())) {
                date = d.toLocaleDateString();
                time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            }
            let locationLabel = 'Location not available';
            if (lt.location?.coordinates?.lat && lt.location?.coordinates?.lng) {
              locationLabel = `${Number(lt.location.coordinates.lat).toFixed(4)}, ${Number(lt.location.coordinates.lng).toFixed(4)}`;
            }
            const status = (lt.status || 'Open').toString();
            const resolverName = lt.assignedTo?.name || 'Not assigned';
            return {
              id: lt.id,
              category: lt.category || 'Unknown',
              status,
              subcategory: lt.subcategory || '-',
              date,
              time,
              locationLabel,
              resolverName,
              resolvedDate: undefined,
            } as Ticket;
          });
          setTickets(fallbackMapped);
        } else {
          setTickets(mapped.length > 0 ? mapped : sampleTicketsRef.current);
        }
      } catch (e) {
        console.log('Failed to load tickets from Firestore', e);
        if (!selectedCategory || !selectedSubcategory) {
          try {
            const fb = await getAllTicketsTraverse();
            const mapped: Ticket[] = fb.map((t: any) => {
              let date = '';
              let time = '';
              if (t.createdAtClient) {
                const d = new Date(t.createdAtClient);
                if (!isNaN(d.getTime())) {
                  date = d.toLocaleDateString();
                  time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
              }
              let locationLabel = 'Location not available';
              if (t.location && typeof t.location.latitude === 'number' && typeof t.location.longitude === 'number') {
                locationLabel = `${t.location.latitude.toFixed(4)}, ${t.location.longitude.toFixed(4)}`;
              }
              let resolverLabel = 'Not assigned';
              if (t.assignedGroup) {
                const phone = Array.isArray(t.assignedGroupPhones) && t.assignedGroupPhones.length > 0
                  ? `  ${t.assignedGroupPhones[0]}`
                  : '';
                resolverLabel = `${t.assignedGroup}${phone}`;
              }
              return {
                id: t.ticketNumber || t.id,
                category: t.categoryTitle || 'Unknown',
                status: t.status || 'open',
                subcategory: t.subcategory || '-',
                date,
                time,
                locationLabel,
                resolverName: resolverLabel,
                resolvedDate: t.resolvedAt || t.resolvedDate
                  ? new Date(t.resolvedAt || t.resolvedDate).toLocaleDateString()
                  : undefined,
              } as Ticket;
            });
            if (mapped.length > 0) {
              setTickets(mapped);
            } else if (Array.isArray(localTickets) && localTickets.length > 0) {
              const ltMapped: Ticket[] = localTickets.map((lt: any) => {
                let date = '';
                let time = '';
                if (lt.createdAt) {
                  const d = new Date(lt.createdAt);
                  if (!isNaN(d.getTime())) {
                    date = d.toLocaleDateString();
                    time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                }
                let locationLabel = 'Location not available';
                if (lt.location?.coordinates?.lat && lt.location?.coordinates?.lng) {
                  locationLabel = `${Number(lt.location.coordinates.lat).toFixed(4)}, ${Number(lt.location.coordinates.lng).toFixed(4)}`;
                }
                const status = (lt.status || 'Open').toString();
                const resolverName = lt.assignedTo?.name || 'Not assigned';
                return {
                  id: lt.id,
                  category: lt.category || 'Unknown',
                  status,
                  subcategory: lt.subcategory || '-',
                  date,
                  time,
                  locationLabel,
                  resolverName,
                  resolvedDate: undefined,
                } as Ticket;
              });
              setTickets(ltMapped);
            } else {
              setTickets(sampleTicketsRef.current);
            }
          } catch (e2) {
            console.log('Traverse fallback failed', e2);
            setTickets(Array.isArray(localTickets) && localTickets.length > 0 ? localTickets.map((lt: any) => ({
              id: lt.id,
              category: lt.category || 'Unknown',
              status: (lt.status || 'Open').toString(),
              subcategory: lt.subcategory || '-',
              date: lt.createdAt ? new Date(lt.createdAt).toLocaleDateString() : '',
              time: lt.createdAt ? new Date(lt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
              locationLabel: (lt.location?.coordinates?.lat && lt.location?.coordinates?.lng)
                ? `${Number(lt.location.coordinates.lat).toFixed(4)}, ${Number(lt.location.coordinates.lng).toFixed(4)}`
                : 'Location not available',
              resolverName: lt.assignedTo?.name || 'Not assigned',
              resolvedDate: undefined,
            })) : sampleTicketsRef.current);
          }
        } else {
          setTickets(sampleTicketsRef.current);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedCategory, selectedSubcategory, localTickets]);

  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => (t.status || '').toLowerCase().includes('resolved'));
  const inProgressTickets = tickets.filter(t => !(t.status || '').toLowerCase().includes('resolved'));

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

      {/* Tickets Table */}
      <Text style={styles.listHeader}>All Tickets</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.colSNo]}>S.No</Text>
              <Text style={[styles.headerCell, styles.colId]}>Ticket ID</Text>
              <Text style={[styles.headerCell, styles.colCategory]}>Category</Text>
              <Text style={[styles.headerCell, styles.colSubcategory]}>Sub Category</Text>
              <Text style={[styles.headerCell, styles.colIssue]}>Issue Date & Time</Text>
              <Text style={[styles.headerCell, styles.colResolved]}>Resolved Date</Text>
              <Text style={[styles.headerCell, styles.colResolver]}>Resolver Name</Text>
              <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
            </View>

            <FlatList
              data={tickets}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.emptyText}>No tickets found.</Text>}
              renderItem={({ item, index }) => {
                const statusLower = (item.status || '').toLowerCase();
                const isResolved = statusLower.includes('resolved');
                const statusText = isResolved ? 'Resolved' : 'Pending';
                return (
                  <TouchableOpacity
                    style={styles.tableRow}
                    onPress={() =>
                      // @ts-ignore
                      navigation.navigate('TicketDetail', {
                        categoryTitle: item.category,
                        subcategoryName: item.subcategory,
                        ticketId: item.id,
                      })
                    }
                  >
                    <Text style={[styles.cell, styles.colSNo]}>{index + 1}</Text>
                    <Text style={[styles.cell, styles.colId]}> {item.id} </Text>
                    <Text style={[styles.cell, styles.colCategory, styles.linkText]} numberOfLines={2}>{item.category}</Text>
                    <Text style={[styles.cell, styles.colSubcategory]} numberOfLines={2}>{item.subcategory}</Text>
                    <Text style={[styles.cell, styles.colIssue]}>{item.date} {item.time}</Text>
                    <Text style={[styles.cell, styles.colResolved]}>{item.resolvedDate || '-'}</Text>
                    <Text style={[styles.cell, styles.colResolver]} numberOfLines={1}>{item.resolverName}</Text>
                    <Text style={[styles.cell, styles.colStatus, isResolved ? styles.resolvedText : styles.pendingText]}>
                      {statusText}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </ScrollView>
      )}
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
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontWeight: '700',
    color: '#475569',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#334155',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  linkText: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  colSNo: { width: 60 },
  colId: { width: 120 },
  colCategory: { width: 180 },
  colSubcategory: { width: 200 },
  colIssue: { width: 180 },
  colResolved: { width: 150 },
  colResolver: { width: 180 },
  colStatus: { width: 110 },
  resolvedText: { color: '#16a34a', fontWeight: '700' },
  pendingText: { color: '#f59e0b', fontWeight: '700' },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IncidentList;