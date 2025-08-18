export type Gender = 'male' | 'female'
export type HeightUnit = 'cm' | 'inches'
export type WeightUnit = 'kg' | 'lb'
export type GrowthStandard = 'WHO' | 'CDC'

export interface ChildData {
  gender: Gender
  dateOfBirth: string
  measurementDate: string
  height: number
  heightUnit: HeightUnit
  // Optional fields for extended measurements
  weight?: number
  weightUnit?: WeightUnit
  selectedMeasurements?: ('height' | 'weight' | 'bmi')[]
  motherHeight: number
  fatherHeight: number
  motherHeightUnit: HeightUnit
  fatherHeightUnit: HeightUnit
}

export interface AgeCalculation {
  ageYears: number
  ageMonths: number
  ageInMonths: number
  ageInDays: number
}

export interface LMSData {
  ageMonths: number
  L: number // Lambda (skewness)
  M: number // Mean
  S: number // Coefficient of variation
}

export interface GrowthResult {
  zScore: number
  percentile: number
  standard: GrowthStandard
  interpretation: string
  advice: string
  isNormal: boolean
}

export interface MidParentalHeight {
  mph: number // Mid-parental height
  thrLevel1Min: number // Target height range level 1 minimum
  thrLevel1Max: number // Target height range level 1 maximum
  thrLevel2Min: number // Target height range level 2 minimum
  thrLevel2Max: number // Target height range level 2 maximum
  mphZScore: number // Z-score for mid-parental height
  thrLevel1MinZScore: number // Z-score for target height range level 1 minimum
  thrLevel1MaxZScore: number // Z-score for target height range level 1 maximum
  thrLevel2MinZScore: number // Z-score for target height range level 2 minimum
  thrLevel2MaxZScore: number // Z-score for target height range level 2 maximum
}

export interface CalculationResults {
  childData: ChildData
  age: AgeCalculation
  growthResult: GrowthResult
  midParentalHeight: MidParentalHeight
  chartData: ChartDataPoint[]
}

export interface ChartDataPoint {
  age: number
  percentile3: number
  percentile10: number
  percentile25: number
  percentile50: number
  percentile75: number
  percentile90: number
  percentile97: number
  childHeight?: number
  mphLine?: number
  thrLevel1Min?: number
  thrLevel1Max?: number
  thrLevel2Min?: number
  thrLevel2Max?: number
}
