// import { IncidentCategory } from './../store/slices/incidentSlice';
// export type RootStackParamList = {
//   Home: undefined
//   IncidentCategory: undefined
//   IncidentSubcategory: { category: IncidentCategory }
//   Subcategory: undefined
//   EnhancedTicketSuccess: undefined

// };

export type RootStackParamList = {
  Home: undefined;
  Subcategory: { categoryId: string };
  IncidentList: undefined;
  SimpleTicketSuccess: { incidentName: string; subcategory: string; ticketId: string; location?: { lat: number; lng: number } | null };
  EnhancedTicketSuccess: { ticketId: string };
  TicketDetail: { categoryTitle: string; subcategoryName: string; ticketId: string };
};

// Example of navigation using the updated type
// navigation.navigate('Subcategory', { categoryId: '12345' });
