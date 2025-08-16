import { create } from 'zustand'
import { ChildData, CalculationResults, HeightUnit } from '../types'

interface AppState {
  // Child data
  childData: Partial<ChildData>
  setChildData: (data: Partial<ChildData>) => void
  clearChildData: () => void
  resetForNewCalculation: () => void
  
  // Results
  results: CalculationResults | null
  setResults: (results: CalculationResults) => void
  clearResults: () => void
  
  // UI state
  heightUnit: HeightUnit
  setHeightUnit: (unit: HeightUnit) => void
  
  // Loading states
  isCalculating: boolean
  setIsCalculating: (loading: boolean) => void
}

const initialChildData: Partial<ChildData> = {
  gender: undefined,
  dateOfBirth: '',
  measurementDate: new Date().toISOString().split('T')[0],
  height: undefined,
  heightUnit: 'cm',
  weight: undefined,
  weightUnit: 'kg',
  selectedMeasurements: [],
  motherHeight: undefined,
  fatherHeight: undefined,
  motherHeightUnit: 'cm',
  fatherHeightUnit: 'cm'
}

export const useAppStore = create<AppState>((set) => ({
  // Child data
  childData: initialChildData,
  setChildData: (data) => 
    set((state) => ({ 
      childData: { ...state.childData, ...data } 
    })),
  clearChildData: () => set({ childData: initialChildData }),
  resetForNewCalculation: () => {
    const today = new Date().toISOString().split('T')[0]
    set({
      results: null,
      childData: {
        gender: undefined,
        dateOfBirth: '',
        measurementDate: today,
        height: undefined,
        heightUnit: 'cm',
        weight: undefined,
        weightUnit: 'kg',
        selectedMeasurements: [],
        motherHeight: undefined,
        fatherHeight: undefined,
        motherHeightUnit: 'cm',
        fatherHeightUnit: 'cm'
      }
    })
  },
  
  // Results
  results: null,
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: null }),
  
  // UI state
  heightUnit: 'cm',
  setHeightUnit: (unit) => set({ heightUnit: unit }),
  
  // Loading states
  isCalculating: false,
  setIsCalculating: (loading) => set({ isCalculating: loading }),
}))
