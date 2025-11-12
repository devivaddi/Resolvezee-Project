import React from "react"
import { View, Text, StyleSheet } from "react-native"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

interface EmergencyPrecautionCardProps {
  icon: string
  text: string
  color?: string
}

const EmergencyPrecautionCard: React.FC<EmergencyPrecautionCardProps> = ({ icon, text, color = "#007bff" }) => (
  <View style={[styles.card, { borderColor: color }]}>
    <MaterialIcons name={icon} size={32} color={color} style={styles.icon} />
    <Text style={styles.text}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f4f8fb",
  },
  icon: {
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: "#222",
    flex: 1,
    flexWrap: "wrap",
  },
})

export default EmergencyPrecautionCard