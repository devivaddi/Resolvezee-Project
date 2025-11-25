import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/HomeScreen';
import Subcategory from '../screens/SubcategoryScreen';
import IncidentList from '../screens/IncidentListScreen';
import SimpleTicketSuccess from '../screens/SimpleTicketSuccess';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import { RootStackParamList } from './types';


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{ title: 'Health & Safety Portal' }} />
      <Stack.Screen name="Subcategory" component={Subcategory} options={{ title: 'Select Incident Type' }} />
      <Stack.Screen name="IncidentList" component={IncidentList} options={{ title: 'Incident Tracker' }} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: 'Ticket Detail' }} />
      <Stack.Screen
        name="SimpleTicketSuccess"
        component={SimpleTicketSuccess}
        options={{ title: 'Success Ticket' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
