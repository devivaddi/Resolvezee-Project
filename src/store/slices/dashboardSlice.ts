import { createSlice } from "@reduxjs/toolkit"

// Equipment, Training, and DashboardState interfaces removed for JS compatibility
// Use JSDoc or PropTypes elsewhere if you need type checking

const initialState = {
  equipment: [
    {
      id: "1",
      name: "Fire Extinguisher A1",
      status: "operational",
      lastInspection: "2025-06-15",
      nextInspection: "2025-07-15",
    },
    {
      id: "2",
      name: "Emergency Shower B2",
      status: "maintenance",
      lastInspection: "2025-06-10",
      nextInspection: "2025-06-25",
    },
    {
      id: "3",
      name: "Safety Harness C3",
      status: "critical",
      lastInspection: "2025-05-20",
      nextInspection: "2025-06-20",
    },
  ],
  trainings: [
    {
      id: "1",
      title: "Fire Safety Training",
      dueDate: "2025-06-30",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "First Aid Certification",
      dueDate: "2025-07-15",
      status: "completed",
      priority: "medium",
    },
    {
      id: "3",
      title: "Chemical Handling",
      dueDate: "2025-06-22",
      status: "overdue",
      priority: "high",
    },
  ],
  recentIncidents: [
    {
      id: "1",
      type: "Near Miss",
      location: "Zone A",
      time: "2 hours ago",
      severity: "medium",
    },
    {
      id: "2",
      type: "Equipment Failure",
      location: "Zone C",
      time: "1 day ago",
      severity: "low",
    },
  ],
  safetyMetrics: {
    complianceRate: 96,
    trainingCompletion: 87,
    equipmentUptime: 94,
  },
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateEquipmentStatus: (state, action) => {
      const equipment = state.equipment.find((eq) => eq.id === action.payload.id)
      if (equipment) {
        equipment.status = action.payload.status
      }
    },
    addIncident: (state, action) => {
      const newIncident = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.recentIncidents.unshift(newIncident)
      if (state.recentIncidents.length > 5) {
        state.recentIncidents.pop()
      }
    },
  },
})

export const { updateEquipmentStatus, addIncident } = dashboardSlice.actions
export default dashboardSlice.reducer
