import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  precautions: [
    // Mandatory PPE (Blue)
    {
      id: "1",
      type: "mandatory",
      title: "HARD HATS MUST BE WORN",
      description: "All personnel must wear approved hard hats in designated areas",
      icon: "⛑️",
      color: "blue",
      category: "ppe",
    },
    {
      id: "2",
      type: "mandatory",
      title: "SAFETY GOGGLES MUST BE WORN",
      description: "Eye protection is mandatory in work zones",
      icon: "🥽",
      color: "blue",
      category: "ppe",
    },
    {
      id: "3",
      type: "mandatory",
      title: "PROTECTIVE FOOTWEAR MUST BE WORN",
      description: "Steel-toed boots required in all work areas",
      icon: "👢",
      color: "blue",
      category: "ppe",
    },
    {
      id: "4",
      type: "mandatory",
      title: "HAND PROTECTION MUST BE WORN",
      description: "Gloves must be worn when handling materials",
      icon: "🧤",
      color: "blue",
      category: "ppe",
    },
    {
      id: "5",
      type: "mandatory",
      title: "HIGH VISIBILITY JACKETS MUST BE WORN",
      description: "Hi-vis clothing required in all outdoor areas",
      icon: "🦺",
      color: "blue",
      category: "ppe",
    },
    {
      id: "6",
      type: "mandatory",
      title: "REPORT ALL INJURIES TO SITE AS SOON AS POSSIBLE",
      description: "Immediate reporting of incidents is required",
      icon: "📋",
      color: "blue",
      category: "behavior",
    },
    // Warning Signs (Yellow/Red)
    {
      id: "7",
      type: "warning",
      title: "HEAVY MACHINERY OPERATE ON THIS SITE",
      description: "Caution: Heavy equipment in operation",
      icon: "🚜",
      color: "yellow",
      category: "environment",
    },
    {
      id: "8",
      type: "warning",
      title: "NO SAFE PASS NO ENTRY",
      description: "Valid safety pass required to enter site office",
      icon: "🚫",
      color: "red",
      category: "behavior",
    },
    {
      id: "9",
      type: "warning",
      title: "NO SMOKING AND NO OPEN FLAME ON THIS SITE",
      description: "Smoking and open flames strictly prohibited",
      icon: "🚭",
      color: "red",
      category: "behavior",
    },
    {
      id: "10",
      type: "warning",
      title: "SPEED AND PARKING RESTRICTIONS MUST BE OBSERVED",
      description: "15 km/h speed limit enforced",
      icon: "⚠️",
      color: "yellow",
      category: "behavior",
    },
    {
      id: "11",
      type: "warning",
      title: "UNAUTHORIZED PERSONS NOT ALLOWED ON THIS SITE",
      description: "Authorized personnel only beyond this point",
      icon: "🚷",
      color: "red",
      category: "behavior",
    },
    {
      id: "12",
      type: "warning",
      title: "DANGER AREA FOR CHILDREN",
      description: "Parents must supervise children at all times",
      icon: "👶",
      color: "red",
      category: "environment",
    },
  ],
  todayStats: {
    issuesReported: 0,
    safetyTip: "Keep emergency exits clear at all times",
  },
}

const safetySlice = createSlice({
  name: "safety",
  initialState,
  reducers: {
    updateIssuesReported: (state, action) => {
      state.todayStats.issuesReported = action.payload
    },
    updateSafetyTip: (state, action) => {
      state.todayStats.safetyTip = action.payload
    },
  },
})

export const { updateIssuesReported, updateSafetyTip } = safetySlice.actions
export default safetySlice.reducer
