import React from "react"
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from "react-native"
// SubcategoryType is not exported from incidentSlice, so we define it locally here
export type SubcategoryType = {
  name: string;
};

const { width } = Dimensions.get("window")

interface SubcategoryCardProps {
  subcategory: SubcategoryType
  onPress: (subcategory: SubcategoryType) => void
  color: string
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ subcategory, onPress, color }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={() => onPress(subcategory)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{subcategory.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: (width * 0.8) / 2 - 20,
    height: 120,
    margin: 10,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  cardText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default SubcategoryCard
