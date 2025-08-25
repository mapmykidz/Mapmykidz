import { differenceInDays } from 'date-fns'
import { ChildData, AgeCalculation, LMSData, GrowthResult, MidParentalHeight, GrowthStandard } from '../types'
import { getWHOData } from '../data/whoData_height'
import { getCDCData } from '../data/cdcData_height'
import { getWHOWeightData } from '../data/whoData_weight'
import { getCDCWeightData } from '../data/cdcData_weight'
import { getWHOBMIData } from '../data/whoData_bmi'
import { getCDCBMIData } from '../data/cdcData_bmi'
import { getWHOWeightForLengthData } from '../data/whoData_weightforHeight'

/**
 * Calculate age in years, months, and total months from dates
 * Uses exact fractional months for precise calculations
 */
export const calculateAge = (dateOfBirth: string, measurementDate: string): AgeCalculation => {
  const birth = new Date(dateOfBirth)
  const measurement = new Date(measurementDate)
  
  // Validate dates
  if (isNaN(birth.getTime()) || isNaN(measurement.getTime())) {
    throw new Error('Invalid date format provided')
  }
  
  if (measurement < birth) {
    throw new Error('Measurement date cannot be before birth date')
  }
  
  const ageInDays = differenceInDays(measurement, birth)
  // Calculate exact fractional months using days / 30.4375 (standard month length)
  const ageInMonths = ageInDays / 30.4375
  const ageYears = Math.floor(ageInMonths / 12)
  const ageMonths = Math.floor(ageInMonths % 12)
  
  return {
    ageYears,
    ageMonths,
    ageInMonths,
    ageInDays
  }
}

/**
 * Convert height between cm and inches
 */
export const convertHeight = (height: number, fromUnit: 'cm' | 'inches', toUnit: 'cm' | 'inches'): number => {
  if (height < 0) {
    throw new Error('Height cannot be negative')
  }
  
  if (fromUnit === toUnit) return height
  
  if (fromUnit === 'inches' && toUnit === 'cm') {
    return height * 2.54
  } else if (fromUnit === 'cm' && toUnit === 'inches') {
    return height / 2.54
  }
  
  return height
}

/**
 * Convert weight between kg and lb
 */
export const convertWeight = (weight: number, fromUnit: 'kg' | 'lb', toUnit: 'kg' | 'lb'): number => {
  if (weight < 0) {
    throw new Error('Weight cannot be negative')
  }
  
  if (fromUnit === toUnit) return weight
  
  if (fromUnit === 'lb' && toUnit === 'kg') {
    return weight * 0.45359237
  } else if (fromUnit === 'kg' && toUnit === 'lb') {
    return weight / 0.45359237
  }
  
  return weight
}

/**
 * Interpolate LMS values for a given age
 */
export const interpolateLMS = (ageInMonths: number, lmsData: LMSData[]): LMSData | null => {
  // Validate inputs
  if (ageInMonths < 0) {
    throw new Error('Age cannot be negative')
  }
  
  if (!lmsData || lmsData.length === 0) {
    throw new Error('LMS data array is empty or invalid')
  }
  
  // Find exact match
  const exactMatch = lmsData.find(data => data.ageMonths === ageInMonths)
  if (exactMatch) return exactMatch
  
  // Find the two closest points for interpolation
  const sortedData = lmsData.sort((a, b) => a.ageMonths - b.ageMonths)
  
  let lowerPoint: LMSData | null = null
  let upperPoint: LMSData | null = null
  
  for (let i = 0; i < sortedData.length - 1; i++) {
    if (sortedData[i].ageMonths <= ageInMonths && sortedData[i + 1].ageMonths >= ageInMonths) {
      lowerPoint = sortedData[i]
      upperPoint = sortedData[i + 1]
      break
    }
  }
  
  // If age is outside the range, use the closest point
  if (!lowerPoint && !upperPoint) {
    if (ageInMonths < sortedData[0].ageMonths) {
      return sortedData[0]
    } else {
      return sortedData[sortedData.length - 1]
    }
  }
  
  if (!lowerPoint) return upperPoint
  if (!upperPoint) return lowerPoint
  
  // Linear interpolation
  const ageDiff = upperPoint.ageMonths - lowerPoint.ageMonths
  
  // Handle case where age points are the same
  if (ageDiff === 0) {
    return lowerPoint
  }
  
  const ageRatio = (ageInMonths - lowerPoint.ageMonths) / ageDiff
  
  return {
    ageMonths: ageInMonths,
    L: lowerPoint.L + (upperPoint.L - lowerPoint.L) * ageRatio,
    M: lowerPoint.M + (upperPoint.M - lowerPoint.M) * ageRatio,
    S: lowerPoint.S + (upperPoint.S - lowerPoint.S) * ageRatio
  }
}

/**
 * Calculate Z-score using LMS method
 */
export const calculateZScore = (measurement: number, L: number, M: number, S: number): number => {
  // Validate inputs
  if (measurement <= 0 || M <= 0 || S <= 0) {
    throw new Error('Measurement, M, and S values must be positive')
  }
  
  if (L !== 0) {
    return (Math.pow(measurement / M, L) - 1) / (L * S)
  } else {
    return Math.log(measurement / M) / S
  }
}

/**
 * Convert Z-score to percentile using normal distribution
 */
export const zScoreToPercentile = (zScore: number): number => {
  // Using an approximation of the cumulative normal distribution
  // This is accurate to about 0.1% for most practical purposes
  
  const sign = zScore >= 0 ? 1 : -1
  const x = Math.abs(zScore) / Math.sqrt(2)
  
  // Abramowitz and Stegun approximation
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911
  
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  
  const result = 0.5 * (1 + sign * y)
  return Math.max(0, Math.min(1, result)) * 100
}

/**
 * Determine which growth standard to use (WHO or CDC)
 */
export const determineGrowthStandard = (ageInMonths: number): GrowthStandard => {
  if (ageInMonths <= 24) { // 0-2 years
    return 'WHO'
  } else { // 2-20 years (CDC for children over 2 years)
    return 'CDC'
  }
}

/**
 * Calculate growth result (Z-score and percentile)
 */
export const calculateGrowthResult = (childData: ChildData, age: AgeCalculation): GrowthResult => {
  // Validate child data
  if (!childData || !childData.gender || !childData.height || !childData.heightUnit) {
    throw new Error('Invalid child data provided')
  }
  
  const heightInCm = convertHeight(childData.height, childData.heightUnit, 'cm')
  const standard = determineGrowthStandard(age.ageInMonths)
  
  let lmsData: LMSData[]
  if (standard === 'WHO') {
    lmsData = getWHOData(childData.gender)
  } else {
    lmsData = getCDCData(childData.gender)
  }
  
  // Validate that we got data
  if (!lmsData || lmsData.length === 0) {
    throw new Error(`No growth data available for ${childData.gender} children using ${standard} standard`)
  }
  
  const interpolatedLMS = interpolateLMS(age.ageInMonths, lmsData)
  
  if (!interpolatedLMS) {
    throw new Error('Unable to find appropriate growth data for this age')
  }
  
  const zScore = calculateZScore(heightInCm, interpolatedLMS.L, interpolatedLMS.M, interpolatedLMS.S)
  const percentile = zScoreToPercentile(zScore)
  
  // Generate interpretation and advice
  const { interpretation, advice, isNormal } = generateInterpretation(percentile, zScore, standard)
  
  return {
    zScore: Math.round(zScore * 100) / 100, // Round to 2 decimal places
    percentile: Math.round(percentile * 10) / 10, // Round to 1 decimal place
    standard,
    interpretation,
    advice,
    isNormal
  }
}

/**
 * Generate plain language interpretation and advice
 */
export const generateInterpretation = (percentile: number, zScore: number, standard: GrowthStandard) => {
  let interpretation = ''
  let advice = ''
  let isNormal = true
  
  // Use "length" for WHO standards (0-2 years), "height" for CDC standards (2-20 years)
  const measurementTerm = standard === 'WHO' ? 'length' : 'height'
  
  if (percentile >= 97) {
    interpretation = `Your child's ${measurementTerm} is at the ${percentile.toFixed(1)}th percentile, which means they are taller than ${percentile.toFixed(1)}% of children their age and gender. This is considered very tall.`
    advice = 'Your child is growing very well and is much taller than average. Continue regular check-ups with your healthcare provider.'
    isNormal = true
  } else if (percentile >= 90) {
    interpretation = `Your child's ${measurementTerm} is at the ${percentile.toFixed(1)}th percentile, which means they are taller than ${percentile.toFixed(1)}% of children their age and gender. This is considered tall.`
    advice = 'Your child is growing well and is taller than average. Continue monitoring growth every 6-12 months.'
    isNormal = true
  } else if (percentile >= 75) {
    interpretation = `Your child's ${measurementTerm} is at the ${percentile.toFixed(1)}th percentile, which means they are taller than ${percentile.toFixed(1)}% of children their age and gender. This is considered above average.`
    advice = 'Your child is growing well. Continue regular monitoring and maintain healthy nutrition and exercise habits.'
    isNormal = true
  } else if (percentile >= 25) {
    interpretation = `Your child's ${measurementTerm} is at the ${percentile.toFixed(1)}th percentile, which means they are taller than ${percentile.toFixed(1)}% of children their age and gender. This is considered normal.`
    advice = 'Your child is growing normally. Most children between the 10th and 90th percentile are growing well. Continue monitoring every 6-12 months.'
    isNormal = true
  } else if (percentile >= 10) {
    interpretation = `Your child's ${measurementTerm} is at the ${percentile.toFixed(1)}th percentile, which means they are taller than ${percentile.toFixed(1)}% of children their age and gender. This is considered below average but still within normal range.`
    advice = 'Your child is growing within the normal range, though below average. Monitor growth closely and consult your healthcare provider if you have concerns.'
    isNormal = true
  } else if (percentile >= 3) {
    interpretation = `Your child's ${measurementTerm} is at the ${percentile.toFixed(1)}th percentile, which means they are taller than ${percentile.toFixed(1)}% of children their age and gender. This is considered short stature.`
    advice = 'Your child may have short stature. Consider consulting a pediatrician or pediatric endocrinologist for evaluation.'
    isNormal = false
  } else {
    interpretation = `Your child's ${measurementTerm} is below the 3rd percentile (Z-score: ${zScore.toFixed(2)}), which means they are shorter than 97% of children their age and gender. This indicates significant short stature.`
    advice = 'Your child has significant short stature. It is recommended to consult with a pediatrician or pediatric endocrinologist for further evaluation and possible treatment options.'
    isNormal = false
  }
  
  return { interpretation, advice, isNormal }
}

/**
 * Calculate Mid-parental Height and Target Height Range
 */
export const calculateMidParentalHeight = (childData: ChildData): MidParentalHeight | null => {
  // If child is adopted and parent heights are not provided, return null
  if (childData.isAdopted && (!childData.motherHeight || !childData.fatherHeight)) {
    return null
  }
  
  // Validate child data
  if (!childData || !childData.gender || !childData.motherHeight || !childData.motherHeightUnit || 
      !childData.fatherHeight || !childData.fatherHeightUnit) {
    throw new Error('Invalid child data: missing parent height information')
  }
  
  // Convert all heights to cm
  const motherHeightCm = convertHeight(childData.motherHeight, childData.motherHeightUnit, 'cm')
  const fatherHeightCm = convertHeight(childData.fatherHeight, childData.fatherHeightUnit, 'cm')
  
  let mph: number
  let thrLevel1Min: number, thrLevel1Max: number
  
  if (childData.gender === 'male') {
    // Boys' MPH = (Mother's height + Father's height + 13) / 2
    mph = (motherHeightCm + fatherHeightCm + 13) / 2
    
    // Boys Target Range: MPH ± 10 cm
    thrLevel1Min = mph - 10
    thrLevel1Max = mph + 10
  } else {
    // Girls' MPH = (Mother's height + Father's height - 13) / 2
    mph = (motherHeightCm + fatherHeightCm - 13) / 2
    
    // Girls Target Range: MPH ± 8.5 cm
    thrLevel1Min = mph - 8.5
    thrLevel1Max = mph + 8.5
  }
  
  // Calculate Z-scores for mid-parental height values using 20-year-old CDC standards
  // Following the image specification: "Calculate SDS scoring for MPH + THR based on 20y old boy/girl"
  // ALWAYS use CDC standards for parent Z-scores (2-20 years), regardless of child's age
  const adultAgeMonths = 20 * 12 // 20 years = 240 months
  
  // Always use CDC data for parent Z-scores (adult height standards)
  const lmsData = getCDCData(childData.gender)
  
  // Get LMS values for adult age (20 years)
  const adultLMS = interpolateLMS(adultAgeMonths, lmsData)
  if (!adultLMS) {
    throw new Error('Unable to calculate Z-scores: adult height data not available')
  }
  
  const { L, M, S } = adultLMS
  
  // Calculate Z-scores for mid-parental height values
  const mphZScore = calculateZScore(mph, L, M, S)
  const thrLevel1MinZScore = calculateZScore(thrLevel1Min, L, M, S)
  const thrLevel1MaxZScore = calculateZScore(thrLevel1Max, L, M, S)
  
  return {
    mph: Math.round(mph * 10) / 10, // Round to 1 decimal place
    thrLevel1Min: Math.round(thrLevel1Min * 10) / 10,
    thrLevel1Max: Math.round(thrLevel1Max * 10) / 10,
    mphZScore: Math.round(mphZScore * 100) / 100, // Round to 2 decimal places
    thrLevel1MinZScore: Math.round(thrLevel1MinZScore * 100) / 100,
    thrLevel1MaxZScore: Math.round(thrLevel1MaxZScore * 100) / 100
  }
}

/**
 * Calculate weight percentile and z-score using WHO or CDC standards
 */
export const calculateWeightPercentile = (
  weightKg: number,
  ageInMonths: number,
  gender: 'male' | 'female'
): GrowthResult => {
  // Determine which standard to use
  const standard: GrowthStandard = ageInMonths <= 24 ? 'WHO' : 'CDC'
  
  // Get appropriate data
  const whoData = getWHOWeightData(gender)
  const cdcData = getCDCWeightData(gender)
  const lmsData = ageInMonths <= 24 ? whoData : cdcData
  
  // Interpolate LMS values for the child's age
  const interpolated = interpolateLMS(ageInMonths, lmsData)
  if (!interpolated) {
    throw new Error('Unable to calculate weight percentile: age out of range')
  }
  
  const { L, M, S } = interpolated
  
  // Calculate z-score using LMS method
  let zScore: number
  if (L !== 0) {
    zScore = (Math.pow(weightKg / M, L) - 1) / (L * S)
  } else {
    zScore = Math.log(weightKg / M) / S
  }
  
  // Convert z-score to percentile
  const percentile = zScoreToPercentile(zScore)
  
  // Generate interpretation and advice
  const interpretation = generateWeightInterpretation(percentile, zScore, standard)
  const advice = generateWeightAdvice(percentile, zScore, standard)
  const isNormal = percentile >= 3 && percentile <= 97
  
  return {
    percentile: Math.round(percentile * 10) / 10, // Round to 1 decimal place
    zScore: Math.round(zScore * 100) / 100, // Round to 2 decimal places
    interpretation,
    advice,
    isNormal,
    standard
  }
}

/**
 * Generate weight interpretation based on percentile and z-score
 */
const generateWeightInterpretation = (
  percentile: number,
  _zScore: number,
  _standard: GrowthStandard
): string => {
  if (percentile < 3) {
    return `Your child's weight is below the 3rd percentile, indicating very low weight for age. This may require medical evaluation.`
  } else if (percentile < 10) {
    return `Your child's weight is between the 3rd and 10th percentiles, indicating low weight for age. Consider discussing with your healthcare provider.`
  } else if (percentile < 25) {
    return `Your child's weight is between the 10th and 25th percentiles, indicating below average weight for age.`
  } else if (percentile <= 75) {
    return `Your child's weight is between the 25th and 75th percentiles, indicating normal weight for age.`
  } else if (percentile <= 90) {
    return `Your child's weight is between the 75th and 90th percentiles, indicating above average weight for age.`
  } else if (percentile <= 97) {
    return `Your child's weight is between the 90th and 97th percentiles, indicating high weight for age. Consider discussing with your healthcare provider.`
  } else {
    return `Your child's weight is above the 97th percentile, indicating very high weight for age. This may require medical evaluation.`
  }
}

/**
 * Generate weight advice based on percentile and z-score
 */
const generateWeightAdvice = (
  percentile: number,
  _zScore: number,
  _standard: GrowthStandard
): string => {
  if (percentile < 3) {
    return `Consult with your healthcare provider immediately. Very low weight may indicate underlying health issues or nutritional concerns that need medical attention.`
  } else if (percentile < 10) {
    return `Schedule a visit with your healthcare provider to discuss your child's weight. They can help identify potential causes and develop a plan for healthy weight gain.`
  } else if (percentile < 25) {
    return `Monitor your child's weight regularly. Ensure they are eating a balanced diet with adequate calories and nutrients. Consider consulting with a pediatrician if concerns persist.`
  } else if (percentile <= 75) {
    return `Your child's weight is within the normal range. Continue providing a balanced diet and regular physical activity to maintain healthy growth.`
  } else if (percentile <= 90) {
    return `Your child's weight is above average but still within a healthy range. Focus on balanced nutrition and regular physical activity.`
  } else if (percentile <= 97) {
    return `Consider discussing your child's weight with your healthcare provider. They can help develop strategies for healthy weight management through diet and exercise.`
  } else {
    return `Consult with your healthcare provider immediately. Very high weight may indicate health risks that require medical evaluation and intervention.`
  }
}

/**
 * Calculate BMI from weight and height
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Weight and height must be positive values')
  }
  
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  
  return Math.round(bmi * 100) / 100 // Round to 2 decimal places
}

/**
 * Calculate weight-for-length percentile and z-score using WHO standards (0-2 years)
 */
export const calculateWeightForLengthPercentile = (
  weightKg: number,
  lengthCm: number,
  gender: 'male' | 'female'
): GrowthResult => {
  // Weight-for-length is only used for children 0-2 years (WHO standards)
  const standard: GrowthStandard = 'WHO'
  
  // Get WHO weight-for-length data
  const wflData = getWHOWeightForLengthData(gender)
  
  // Find the closest length value in the data
  const interpolated = interpolateWFL(lengthCm, wflData)
  if (!interpolated) {
    throw new Error('Unable to calculate weight-for-length percentile: length out of range (45-110 cm)')
  }
  
  const { L, M, S } = interpolated
  
  // Calculate z-score using LMS method
  let zScore: number
  if (L !== 0) {
    zScore = (Math.pow(weightKg / M, L) - 1) / (L * S)
  } else {
    zScore = Math.log(weightKg / M) / S
  }
  
  // Convert z-score to percentile
  const percentile = zScoreToPercentile(zScore)
  
  // Generate interpretation and advice
  const interpretation = generateWeightForLengthInterpretation(percentile, zScore)
  const advice = generateWeightForLengthAdvice(percentile, zScore)
  const isNormal = percentile >= 3 && percentile <= 97
  
  return {
    percentile: Math.round(percentile * 10) / 10, // Round to 1 decimal place
    zScore: Math.round(zScore * 100) / 100, // Round to 2 decimal places
    interpretation,
    advice,
    isNormal,
    standard
  }
}

/**
 * Interpolate weight-for-length LMS values for a given length
 */
const interpolateWFL = (lengthCm: number, wflData: any[]): any | null => {
  if (!wflData || wflData.length === 0) return null
  
  // Find the closest length values
  let lowerIndex = -1
  let upperIndex = -1
  
  for (let i = 0; i < wflData.length; i++) {
    if (wflData[i].length === lengthCm) {
      return wflData[i] // Exact match
    }
    if (wflData[i].length < lengthCm) {
      lowerIndex = i
    } else {
      upperIndex = i
      break
    }
  }
  
  // If length is outside the range
  if (lowerIndex === -1) {
    return wflData[0] // Use first value
  }
  if (upperIndex === -1) {
    return wflData[wflData.length - 1] // Use last value
  }
  
  // Interpolate between the two closest values
  const lower = wflData[lowerIndex]
  const upper = wflData[upperIndex]
  const ratio = (lengthCm - lower.length) / (upper.length - lower.length)
  
  return {
    length: lengthCm,
    L: lower.L + (upper.L - lower.L) * ratio,
    M: lower.M + (upper.M - lower.M) * ratio,
    S: lower.S + (upper.S - lower.S) * ratio
  }
}

/**
 * Calculate BMI percentile and z-score using WHO or CDC standards
 */
export const calculateBMIPercentile = (
  bmi: number,
  ageInMonths: number,
  gender: 'male' | 'female'
): GrowthResult => {
  // Determine which standard to use
  const standard: GrowthStandard = ageInMonths <= 24 ? 'WHO' : 'CDC'
  
  // Get appropriate data
  const whoData = getWHOBMIData(gender)
  const cdcData = getCDCBMIData(gender)
  const lmsData = ageInMonths <= 24 ? whoData : cdcData
  
  // Interpolate LMS values for the child's age
  const interpolated = interpolateLMS(ageInMonths, lmsData)
  if (!interpolated) {
    throw new Error('Unable to calculate BMI percentile: age out of range')
  }
  
  const { L, M, S } = interpolated
  
  // Calculate z-score using LMS method
  let zScore: number
  if (L !== 0) {
    zScore = (Math.pow(bmi / M, L) - 1) / (L * S)
  } else {
    zScore = Math.log(bmi / M) / S
  }
  
  // Convert z-score to percentile
  const percentile = zScoreToPercentile(zScore)
  
  // Generate interpretation and advice
  const interpretation = generateBMIInt(percentile, zScore, standard)
  const advice = generateBMIAdvice(percentile, zScore, standard)
  const isNormal = percentile >= 3 && percentile <= 97
  
  return {
    percentile: Math.round(percentile * 10) / 10, // Round to 1 decimal place
    zScore: Math.round(zScore * 100) / 100, // Round to 2 decimal places
    interpretation,
    advice,
    isNormal,
    standard
  }
}

/**
 * Generate weight-for-length interpretation based on percentile and z-score
 */
const generateWeightForLengthInterpretation = (
  percentile: number,
  _zScore: number
): string => {
  if (percentile < 3) {
    return `Your child's weight-for-length is below the 3rd percentile, indicating very low weight for their length. This may require medical evaluation.`
  } else if (percentile < 10) {
    return `Your child's weight-for-length is between the 3rd and 10th percentiles, indicating low weight for their length. Consider discussing with your healthcare provider.`
  } else if (percentile < 25) {
    return `Your child's weight-for-length is between the 10th and 25th percentiles, indicating below average weight for their length.`
  } else if (percentile <= 75) {
    return `Your child's weight-for-length is between the 25th and 75th percentiles, indicating normal weight for their length.`
  } else if (percentile <= 90) {
    return `Your child's weight-for-length is between the 75th and 90th percentiles, indicating above average weight for their length.`
  } else if (percentile <= 97) {
    return `Your child's weight-for-length is between the 90th and 97th percentiles, indicating elevated weight for their length. Continue monitoring growth patterns and discuss with your healthcare provider if concerns arise.`
  } else {
    return `Your child's weight-for-length is above the 97th percentile, indicating very high weight for their length. This may require medical evaluation.`
  }
}

/**
 * Generate weight-for-length advice based on percentile and z-score
 */
const generateWeightForLengthAdvice = (
  percentile: number,
  _zScore: number
): string => {
  if (percentile < 3) {
    return `Consult with your healthcare provider immediately. Very low weight-for-length may indicate underlying health issues or nutritional concerns that need medical attention.`
  } else if (percentile < 10) {
    return `Schedule a visit with your healthcare provider to discuss your child's weight-for-length. They can help identify potential causes and develop a plan for healthy weight gain.`
  } else if (percentile < 25) {
    return `Monitor your child's weight-for-length regularly. Ensure they are eating a balanced diet with adequate calories and nutrients. Consider consulting with a pediatrician if concerns persist.`
  } else if (percentile <= 75) {
    return `Your child's weight-for-length is within the normal range. Continue providing a balanced diet and age-appropriate physical activity to maintain healthy growth.`
  } else if (percentile <= 90) {
    return `Your child's weight-for-length is above average but still within a healthy range. Focus on balanced nutrition and age-appropriate physical activity.`
  } else if (percentile <= 97) {
    return `Continue monitoring your child's growth patterns. Ensure balanced nutrition and age-appropriate physical activity. Discuss with your healthcare provider if this pattern continues or if you have concerns.`
  } else {
    return `Consult with your healthcare provider immediately. Very high weight-for-length may indicate health concerns that need medical evaluation and intervention.`
  }
}

/**
 * Generate BMI interpretation based on percentile and z-score
 */
const generateBMIInt = (
  percentile: number,
  _zScore: number,
  _standard: GrowthStandard
): string => {
  if (percentile < 3) {
    return `Your child's BMI is below the 3rd percentile, indicating very low BMI for age. This may require medical evaluation.`
  } else if (percentile < 10) {
    return `Your child's BMI is between the 3rd and 10th percentiles, indicating low BMI for age. Consider discussing with your healthcare provider.`
  } else if (percentile < 25) {
    return `Your child's BMI is between the 10th and 25th percentiles, indicating below average BMI for age.`
  } else if (percentile <= 75) {
    return `Your child's BMI is between the 25th and 75th percentiles, indicating normal BMI for age.`
  } else if (percentile <= 90) {
    return `Your child's BMI is between the 75th and 90th percentiles, indicating above average BMI for age.`
  } else if (percentile <= 97) {
    return `Your child's BMI is between the 90th and 97th percentiles, indicating high BMI for age. Consider discussing with your healthcare provider.`
  } else {
    return `Your child's BMI is above the 97th percentile, indicating very high BMI for age. This may require medical evaluation.`
  }
}

/**
 * Generate BMI advice based on percentile and z-score
 */
const generateBMIAdvice = (
  percentile: number,
  _zScore: number,
  _standard: GrowthStandard
): string => {
  if (percentile < 3) {
    return `Consult with your healthcare provider immediately. Very low BMI may indicate underlying health issues or nutritional concerns that need medical attention.`
  } else if (percentile < 10) {
    return `Schedule a visit with your healthcare provider to discuss your child's BMI. They can help identify potential causes and develop a plan for healthy weight gain.`
  } else if (percentile < 25) {
    return `Monitor your child's BMI regularly. Ensure they are eating a balanced diet with adequate calories and nutrients. Consider consulting with a pediatrician if concerns persist.`
  } else if (percentile <= 75) {
    return `Your child's BMI is within the normal range. Continue providing a balanced diet and regular physical activity to maintain healthy growth.`
  } else if (percentile <= 90) {
    return `Your child's BMI is above average but still within a healthy range. Focus on balanced nutrition and regular physical activity.`
  } else if (percentile <= 97) {
    return `Consider discussing your child's BMI with your healthcare provider. They can help develop strategies for healthy weight management through diet and exercise.`
  } else {
    return `Consult with your healthcare provider immediately. Very high BMI may indicate health risks that require medical evaluation and intervention.`
  }
}
