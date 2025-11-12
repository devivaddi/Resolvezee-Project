import { configureStore } from '@reduxjs/toolkit';
import reportReducer from '../store/slices/reportSlice';
import incidentReducer from '../store/slices/incidentSlice';
import ticketReducer from '../store/slices/ticketSlice';

export const store = configureStore({
  reducer: {
    report: reportReducer,
    incident: incidentReducer,
    ticket: ticketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
