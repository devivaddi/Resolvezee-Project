import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';


type SimpleTicketSuccessProps = NativeStackScreenProps<RootStackParamList, 'SimpleTicketSuccess'>;

const SimpleTicketSuccess: React.FC<SimpleTicketSuccessProps> = ({ route, navigation }) => {
  const { incidentName, subcategory, ticketId, location } = route.params;

  const redirectRef = useRef<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setFormattedTime(now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));

    const fetchAddress = async () => {
      if (location) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          );
          const data: any = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        } catch (error) {
          console.log('Error fetching address:', error);
        }
      }
    };

    fetchAddress();
  }, [location]);

  useEffect(() => {
    // Auto-send WhatsApp to Resolver
    const sendWhatsApp = async () => {
      // Using the resolver phone number provided by user
      const resolverPhone = '919390662649';

      let locationDetails = "N/A";
      if (location) {
        locationDetails = `https://maps.google.com/?q=${location.lat},${location.lng}`;
      }

      // If address is fetched by the time this runs (1.5s), use it. 
      // Note: This closure might capture the initial 'address' state (null). 
      // To get the latest address, we'd typically need to use a ref or include address in dependency, 
      // but including address in dependency would re-trigger the timer.
      // For simplicity, we'll try to fetch it again or just use the link. 
      // Let's just use the link for reliability in the auto-message, 
      // but if we want the address text, we might need to wait.
      // Given the user request, let's try to include the address if possible.
      // We can do a quick fetch here too or just rely on the link.
      // User asked to "add the address the ticket details".

      let addressText = "Fetching...";
      if (location) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          );
          const data: any = await response.json();
          if (data && data.display_name) {
            addressText = data.display_name;
          } else {
            addressText = "Address not found";
          }
        } catch (e) {
          addressText = "Unable to fetch address";
        }
      }

      const message = `*New Incident Report*\n\n` +
        `*ID:* ${ticketId}\n` +
        `*Time:* ${new Date().toLocaleString()}\n` +
        `*Incident:* ${incidentName}\n` +
        `*Subcategory:* ${subcategory}\n` +
        `*Location:* ${addressText}\n` +
        `*Coordinates:* ${location ? `${location.lat}, ${location.lng}` : 'N/A'}\n` +
        `*Map Link:* ${locationDetails}\n\n` +
        `Please review immediately.`;

      const url = `whatsapp://send?phone=${resolverPhone}&text=${encodeURIComponent(message)}`;

      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("WhatsApp not installed or url not supported");
        }
      } catch (err) {
        console.error(err);
      }
    };

    const whatsappTimer = setTimeout(() => {
      sendWhatsApp();
    }, 2000); // Increased slightly to allow address fetch

    redirectRef.current = setTimeout(() => {
      navigation.navigate('Home');
    }, 8000); // Increased to allow reading

    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
      clearTimeout(whatsappTimer);
    };
  }, [navigation, ticketId, incidentName, subcategory, location]);

  return (
    <SafeAreaView style={styles.safe}>
      

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
           

            <View style={styles.infoRow}>
              <Ionicons name="location-sharp" size={16} color="#6b7280" />
              <Text style={styles.infoText} numberOfLines={2}>
                {`Location: ${address ? address : (location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Not available')}`}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{`Date & Time: ${formattedTime}`}</Text>
            </View>
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
  locationContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  addressText: {
    marginLeft: 6,
    marginTop: 2,
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#4b5563',
  },
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