import { createSlice } from "@reduxjs/toolkit"

// Removed TypeScript interface and type annotations for JavaScript compatibility

const initialState = {
  temperature: 24,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  safetyAlert: null,
}

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    updateWeather: (state, action) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { updateWeather } = weatherSlice.actions
export default weatherSlice.reducer
