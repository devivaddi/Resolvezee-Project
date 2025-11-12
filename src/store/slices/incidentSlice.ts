import { createSlice, PayloadAction } from '@reduxjs/toolkit';

 
export interface IncidentCategory {
  id: string;
  title: string;
  icon: string;
  subcategories: string[];
}
 
export interface IncidentState {
  categories: IncidentCategory[];
  selectedCategory: IncidentCategory | null;
  selectedSubcategory: string | null;
  visibleCards: number;
  showDropdown: boolean;
}
 
const initialState: IncidentState = {
  categories: [
    {
      id: '1',
      title: 'Machinery Accidents',
      icon: '⚙️',
      subcategories: [
        'Entanglement',
        'Crushing',
        'Shearing',
        'Impact',
        'Caught-In/Between',
        'Pinch Point',
        'Electric Shock',
        'Arc Flash/Blast',
        'Burns (Thermal Contact)',
        'Overturn/Tip-Over',
        'Mechanical Failure',
        'Flying Debris',
        'High Noise Exposure',
        'Vibration-Related Injuries',
        'Repetitive Strain Injuries',
        'Chemical Exposure'
      ]
    },
    {
      id: '2',
      title: 'Chemical Accidents',
      icon: '🧪',
      subcategories: [
        'Chemical Burns',
        'Inhalation of Fumes',
        'Chemical Spills',
        'Explosions',
        'Fire from Flammable Chemicals',
        'Chemical Splash Injuries',
        'Asphyxiation',
        'Chemical Leak',
        'Corrosive Exposure',
        'Poisoning',
        'Allergic Reactions',
        'Long-Term Toxic Exposure',
        'Improper Chemical Mixing',
        'Environmental Contamination',
        'Chemical Waste Disposal Incidents'
      ]
    },
    {
      id: '3',
      title: 'Fire & Explosion',
      icon: '🔥',
      subcategories: ['Gas Leak Explosions',
        'Flammable Liquid Fires',
        'Dust Explosions',
        'Electrical Fires',
        'Boiler Explosions',
        'Hot Work Fires',
        'Spontaneous Combustion',
        'Battery Fires',
        'Chemical Reaction Explosions',
        'Fires from Static Electricity',
        'Cooking Oil Fires',
        'Compressed Gas Cylinder Explosions',
        'Arson or Intentional Fires',
        'Vehicle or Equipment Fires',
        'Overheating Fires',
        'Waste or Trash Fires',
        'Environmental Fire Hazards'
      ]
    },
    {
      id: '4',
      title: 'Material Handling',
      icon: '📦',
      subcategories: ['Dropped Loads',
        'Manual Lifting Injuries',
        'Overexertion',
        'Caught-In/Between Incidents',
        'Slip and Trip Hazards',
        'Forklift and Vehicle Incidents',
        'Pallet Jack Accidents',
        'Overstacking Hazards',
        'Improper Storage Incidents',
        'Crane or Hoist Failures',
        'Ergonomic Strain Injuries',
        'Chemical Exposure from Spills',
        'Mechanical Handling Injuries',
        'Environmental Contamination',
        'Loading Dock Accidents',
        'Repetitive Motion Injuries',
        'Vehicle Overloading Incidents'
      ]
    },
    {
      id: '5',
      title: 'Waste Management',
      icon: '♻️',
      subcategories: ['Exceeding Permitted Discharge Limits',
        'Unauthorized Discharge',
        'High pH or Low pH Discharge',
        'Oil or Grease Discharge',
        'Excessive Suspended Solids',
        'High Biochemical Oxygen Demand (BOD)',
        'Chemical Spills in Wastewater',
        'Temperature Exceedance',
        'Metal Contaminant Discharge',
        'Chemical Spills',
        'Leaking Waste Containers',
        'Improper Waste Disposal',
        'Waste Storage Overflows',
        'Inadequate PPE Usage',
        'Exposure to Toxic Gases',
        'Fire Hazards',
        'Injury During Waste Handling',
        'Non-Compliance with Regulations'
      ]
    },
    {
      id: '6',
      title: 'Aircraft Ground Handling',
      icon: '✈️',
      subcategories: ['Equipment Collisions',
        'Aircraft Damage',
        'FOD (Foreign Object Debris)',
        'Fuel Spill/Leak',
        'Ramp Vehicle Accidents',
        'Jet Blast',
        'Passenger/Staff Injury',
        'Incorrect Loading/Offloading',
        'Aircraft Tug Towbar Failure',
        'De-Icing Fluid Spill',
        'Communication Errors',
        'Ground Power Unit (GPU) Issues',
        'Catering/Service Vehicle Errors',
        'Weather-Related Incidents'
      ]
    },
    {
      id: '7',
      title: 'Assembly Line Incidents',
      icon: '⚡',
      subcategories: [
        'Repetitive Strain Injuries',
        'Human Error',
        'Safety Protocol Violation',
        'Power Outage',
        'Chemical Spill',
        'Conveyor Belt Issue',
        'Machine Malfunction',
        'Slip and Fall',
        'Material Jam',
        'Fire'
      ]
    },
    {
      id: '8',
      title: 'Chemical Exposure',
      icon: '🧪',
      subcategories: ['Battery Acid Burns']
    },
    {
      id: '9',
      title: 'Ergonomics',
      icon: '🧍',
      subcategories: ['Poor Posture Injuries']
    },
    {
      id: '10',
      title: 'Tool & Equipment',
      icon: '🛠️',
      subcategories: ['Cutting Injuries']
    },
    {
      id: '11',
      title: 'Fire & Explosion',
      icon: '🔥',
      subcategories: ['Flammable Liquid Fires']
    },
    {
      id: '12',
      title: 'Food Preparation',
      icon: '🍽️',
      subcategories: ['Burns']
    },
    {
      id: '13',
      title: 'Housekeeping',
      icon: '🧹',
      subcategories: ['Slips and falls']
    },
    {
      id: '14',
      title: 'Guest Safety',
      icon: '🛎️',
      subcategories: ['Violent Incidents']
    },
    {
      id: '15',
      title: 'Electrical Incidents',
      icon: '⚡',
      subcategories: ['Electrocution']
    },
    {
      id: '16',
      title: 'Environmental Hazard',
      icon: '🌱',
      subcategories: ['Air quality issues']
    },
    {
      id:'17',
      title: 'Chemical Exposure',
      icon: '🧪',
      subcategories: ['Cleaning Agent Burns']
    },
    {
      id: '18',
      title: 'Entanglement Incidents',
      icon: '🪢',
      subcategories: ['Clothing/Body Part Entanglement',
                     'Loose Object Entanglement']
    },
    {
      id: '19',
      title: 'Crushing Accidents',
      icon: '🪨',
      subcategories: ['Pinch Points',
                     'Machine Overturn']
    },
    {
      id: '20',
      title: 'Cutting and Shearing',
      icon: '✂️',
      subcategories: ['Sharp Tool/Blade Contact',
                     'Flying Debris']
    },
    {
      id: '21',
      title: 'Caught-In/Between',
      icon: '🪤',
      subcategories: [ 'Conveyor Belt Incidents',
                     'Press Machines']
    },
    {
      id: '22',
      title: 'Electrical Incidents',
      icon: '⚡',
      subcategories: ['Electric Shock',
                     'Arc Flash/Blast']
 
    },
         {
      id: '23',
      title: 'Mechanical Failure',
      icon: '⚙️',
      subcategories: ['Hydraulic Pressure Failure',
                     'Loss of Guarding',]
    },
    {
      id: '24',
      title: 'Vibration-Related Injuries',
      icon: '🎛️',
      subcategories: ['Hand-Arm Vibration Syndrome (HAVS)']
    },
    {
      id: '25',
      title: 'Noise Exposure',
      icon: '🔊',
      subcategories: ['High Noise from Machinery']
    },
    {
      id: '26',
      title: 'Ergonomic Strains',
      icon: '🤸',
      subcategories: ['Repetitive Motion']
    },
    {
      id: '27',
      title: 'Heat-Related Incidents',
      icon: '🌡️',
      subcategories: ['Burns from Overheating Equipment']
    },
    {
      id: '28',
      title: 'Dust and Particle Exposure',
      icon: '🌫️',
      subcategories: ['Respiratory Hazards']
    },
  ],
  selectedCategory: null,
  selectedSubcategory: null,
  visibleCards: 8, // Show 8 cards (2 rows of 4)
  showDropdown: false,};
 
const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<IncidentCategory>) => {
      state.selectedCategory = action.payload;
    },
    selectSubcategory: (state, action: PayloadAction<string>) => {
      state.selectedSubcategory = action.payload;
    },
    setVisibleCards: (state, action: PayloadAction<number>) => {
      state.visibleCards = action.payload;
    },
    toggleDropdown: (state) => {
      state.showDropdown = !state.showDropdown;
    },
    resetSelection: (state) => {
      state.selectedCategory = null;
      state.selectedSubcategory = null;
    },
  },
});
 
export const {
  selectCategory,
  selectSubcategory,
  setVisibleCards,
  toggleDropdown,
  resetSelection,
} = incidentSlice.actions;
 
export default incidentSlice.reducer;