import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png'; // Placeholder logo

const Header: React.FC = () => (
  <View style={styles.container}>
    <Image source={{ uri: LOGO_URL }} style={styles.logo} />
    <Text style={styles.title}>Awesome Project</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 1,
  },
});

export default Header;
