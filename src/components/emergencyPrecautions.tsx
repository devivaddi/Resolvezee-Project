import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EmergencyPrecautionCard from './EmergencyPrecautionCard';

const emergencyPrecautions = [
  { icon: 'hard-hat', text: 'Hard hats must be worn' },
  { icon: 'safety-goggles', text: 'Safety goggles must be worn' },
  { icon: 'shoe-steel-toe', text: 'Protective footwear must be worn' },
  { icon: 'hand', text: 'Hand protection must be worn' },
  { icon: 'vest', text: 'High visibility jackets must be worn' },
  { icon: 'alert-circle', text: 'Report all injuries to site as soon as possible' },
];

const EmergencyPrecautions = () => (
  <View style={styles.container}>
    <Text style={styles.heading}>Emergency Precautions</Text>
    {emergencyPrecautions.map((item, idx) => (
      <EmergencyPrecautionCard key={idx} icon={item.icon} text={item.text} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
});

export default EmergencyPrecautions;
