import { createSlice } from "@reduxjs/toolkit"

interface ReportState {
  currentTicketId: string | null;
  assignedStaff: string;
  slaTimeRemaining: number;
  totalIssuesRaised: number;
  selectedIncident: any | null;
  selectedSubcategory: any | null;
  reporting: boolean; // <-- Add this line
}

const initialState: ReportState = {
  currentTicketId: null,
  assignedStaff: "",
  slaTimeRemaining: 0,
  totalIssuesRaised: 0,
  selectedIncident: null,
  selectedSubcategory: null,
  reporting: false, // <-- Add this line
}



const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setTicketId: (state, action) => {
      state.currentTicketId = action.payload
    },
    updateTimer: (state) => {
      if (state.slaTimeRemaining > 0) {
        state.slaTimeRemaining -= 1
      }
    },
    resetTicket: (state) => {
      state.currentTicketId = null
    },
    clearReportState: (state) => {
      state.selectedIncident = null
      state.selectedSubcategory = null
    },
    setReporting(state, action) {
      state.reporting = action.payload;
    },
    addReport() {
      // ...your logic...
    },
    // ...other reducers...
  },
});

export const {
  setTicketId,
  updateTimer,
  resetTicket,
  clearReportState,
  setReporting,
  addReport
} = reportSlice.actions

export default reportSlice.reducer
