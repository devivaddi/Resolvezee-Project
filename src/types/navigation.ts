export type RootStackParamList = {
  Home: undefined;
  IncidentCategory: undefined;
  Subcategory: { categoryId: string };
  TicketForm: { categoryId: string; subcategory: string };
  TicketSuccess: { ticketId: string; subcategory: string };
};