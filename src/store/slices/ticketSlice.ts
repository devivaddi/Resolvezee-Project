import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface TicketDetails {
  id: string
  category: string
  subcategory: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  assignedTo: {
    name: string
    role: string
    department: string
    avatar: string
    email: string
    phone: string
  }
  location: {
    building: string
    floor: string
    room: string
    coordinates?: { lat: number; lng: number }
  }
  sla: {
    totalTime: number // in seconds
    timeRemaining: number
    startTime: string
    targetTime: string
  }
  reporter: {
    name: string
    department: string
    email: string
    phone: string
  }
  description: string
  witnesses: string[]
  equipmentInvolved?: string
  immediateActions?: string
  severity: "Low" | "Medium" | "High" | "Critical"
  attachments?: string[]
  createdAt: string
  updatedAt: string
  timeline: Array<{
    timestamp: string
    action: string
    user: string
    details: string
  }>
}

interface TicketState {
  currentTicket: TicketDetails | null
  tickets: TicketDetails[]
  isGenerating: boolean
  generationProgress: number
  isLoading: boolean
}

const initialState: TicketState = {
  currentTicket: null,
  tickets: [],
  isGenerating: false,
  generationProgress: 0,
  isLoading: false,
}

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    startTicketGeneration: (state) => {
      state.isGenerating = true
      state.generationProgress = 0
    },
    updateGenerationProgress: (state, action: PayloadAction<number>) => {
      state.generationProgress = action.payload
    },
    createTicket: (state, action: PayloadAction<Partial<TicketDetails>>) => {
      const ticketId = `TKT-${Date.now()}`
      const now = new Date().toISOString()

      const newTicket: TicketDetails = {
        id: ticketId,
        category: action.payload.category || "",
        subcategory: action.payload.subcategory || "",
        priority: action.payload.priority || "High",
        status: "Open",
        assignedTo: action.payload.assignedTo || {
          name: "Emily Chen",
          role: "Safety Officer",
          department: "Safety & Compliance",
          avatar: "EC",
          email: "emily.chen@company.com",
          phone: "+91 9390662649",
        },
        location: action.payload.location || {
          building: "Main Production Facility",
          floor: "Ground Floor",
          room: "Production Area A",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        sla: {
          totalTime: 14400, // 4 hours
          timeRemaining: 14400,
          startTime: now,
          targetTime: new Date(Date.now() + 14400000).toISOString(),
        },
        reporter: action.payload.reporter || {
          name: "John Doe",
          department: "Production",
          email: "john.doe@company.com",
          phone: "+1 (555) 987-6543",
        },
        description: action.payload.description || "Incident reported via mobile app",
        witnesses: action.payload.witnesses || ["Jane Smith", "Mike Johnson"],
        equipmentInvolved: action.payload.equipmentInvolved || "Heavy Machinery Unit #A-123",
        immediateActions: action.payload.immediateActions || "Area secured, equipment shut down",
        severity: action.payload.severity || "High",
        attachments: action.payload.attachments || [],
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            timestamp: now,
            action: "Ticket Created",
            user: "System",
            details: "Incident report submitted via mobile application",
          },
          {
            timestamp: now,
            action: "Assigned",
            user: "Auto-Assignment System",
            details: `Automatically assigned to ${action.payload.assignedTo?.name || "Emily Chen"}`,
          },
        ],
      }

      state.currentTicket = newTicket
      state.tickets.push(newTicket)
      state.isGenerating = false
      state.generationProgress = 100
    },
    updateTicketTimer: (state) => {
      if (state.currentTicket && state.currentTicket.sla.timeRemaining > 0) {
        state.currentTicket.sla.timeRemaining -= 1
      }
    },
    resetCurrentTicket: (state) => {
      state.currentTicket = null
      state.isGenerating = false
      state.generationProgress = 0
    },
    updateTicketStatus: (state, action: PayloadAction<{ id: string; status: TicketDetails["status"] }>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id)
      if (ticket) {
        ticket.status = action.payload.status
        ticket.updatedAt = new Date().toISOString()
        ticket.timeline.push({
          timestamp: new Date().toISOString(),
          action: "Status Updated",
          user: "System",
          details: `Status changed to ${action.payload.status}`,
        })
      }
    },
  },
})

export const {
  startTicketGeneration,
  updateGenerationProgress,
  createTicket,
  updateTicketTimer,
  resetCurrentTicket,
  updateTicketStatus,
} = ticketSlice.actions

export default ticketSlice.reducer
