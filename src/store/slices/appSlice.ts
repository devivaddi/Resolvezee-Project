import { createSlice } from "@reduxjs/toolkit"

interface AppState {
  totalIssuesRaised: number
  currentDateTime: string
  safetyTips: string[]
  currentTipIndex: number
}

const initialState: AppState = {
  totalIssuesRaised: 0,
  currentDateTime: new Date().toISOString(),
  safetyTips: [
    "Always wear appropriate PPE in designated areas",
    "Report any unsafe conditions immediately",
    "Keep emergency exits clear at all times",
    "Follow proper lifting techniques to prevent injury",
    "Wash hands regularly to prevent contamination",
  ],
  currentTipIndex: 0,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    incrementIssueCount: (state) => {
      state.totalIssuesRaised += 1
    },
    updateDateTime: (state) => {
      state.currentDateTime = new Date().toISOString()
    },
    nextSafetyTip: (state) => {
      state.currentTipIndex = (state.currentTipIndex + 1) % state.safetyTips.length
    },
  },
})

export const { incrementIssueCount, updateDateTime, nextSafetyTip } = appSlice.actions
export default appSlice.reducer
