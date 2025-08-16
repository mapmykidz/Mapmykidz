import { LMSData } from '../types'

// Official WHO Weight-for-age standards (0-2 years) - Boys
export const WHO_WEIGHT_BOYS: LMSData[] = [
  { ageMonths: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
  { ageMonths: 1, L: 0.2297, M: 4.4709, S: 0.13395 },
  { ageMonths: 2, L: 0.197, M: 5.5675, S: 0.12385 },
  { ageMonths: 3, L: 0.1738, M: 6.3762, S: 0.11727 },
  { ageMonths: 4, L: 0.1553, M: 7.0023, S: 0.11316 },
  { ageMonths: 5, L: 0.1395, M: 7.5105, S: 0.1108 },
  { ageMonths: 6, L: 0.1257, M: 7.934, S: 0.10958 },
  { ageMonths: 7, L: 0.1134, M: 8.297, S: 0.10902 },
  { ageMonths: 8, L: 0.1021, M: 8.6151, S: 0.10882 },
  { ageMonths: 9, L: 0.0917, M: 8.9014, S: 0.10881 },
  { ageMonths: 10, L: 0.082, M: 9.1649, S: 0.10891 },
  { ageMonths: 11, L: 0.073, M: 9.4122, S: 0.10906 },
  { ageMonths: 12, L: 0.0644, M: 9.6479, S: 0.10925 },
  { ageMonths: 13, L: 0.0563, M: 9.8749, S: 0.10949 },
  { ageMonths: 14, L: 0.0487, M: 10.0953, S: 0.10976 },
  { ageMonths: 15, L: 0.0413, M: 10.3108, S: 0.11007 },
  { ageMonths: 16, L: 0.0343, M: 10.5228, S: 0.11041 },
  { ageMonths: 17, L: 0.0275, M: 10.7319, S: 0.11079 },
  { ageMonths: 18, L: 0.0211, M: 10.9385, S: 0.11119 },
  { ageMonths: 19, L: 0.0148, M: 11.143, S: 0.11164 },
  { ageMonths: 20, L: 0.0087, M: 11.3462, S: 0.11211 },
  { ageMonths: 21, L: 0.0029, M: 11.5486, S: 0.11261 },
  { ageMonths: 22, L: -0.0028, M: 11.7504, S: 0.11314 },
  { ageMonths: 23, L: -0.0083, M: 11.9514, S: 0.11369 },
  { ageMonths: 24, L: -0.0137, M: 12.1515, S: 0.11426 }
]

// Official WHO Weight-for-age standards (0-2 years) - Girls
export const WHO_WEIGHT_GIRLS: LMSData[] = [
  { ageMonths: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
  { ageMonths: 1, L: 0.1714, M: 4.1873, S: 0.13724 },
  { ageMonths: 2, L: 0.0962, M: 5.1282, S: 0.13 },
  { ageMonths: 3, L: 0.0402, M: 5.8458, S: 0.12619 },
  { ageMonths: 4, L: -0.005, M: 6.4237, S: 0.12402 },
  { ageMonths: 5, L: -0.043, M: 6.8985, S: 0.12274 },
  { ageMonths: 6, L: -0.0756, M: 7.297, S: 0.12204 },
  { ageMonths: 7, L: -0.1039, M: 7.6422, S: 0.12178 },
  { ageMonths: 8, L: -0.1288, M: 7.9487, S: 0.12181 },
  { ageMonths: 9, L: -0.1507, M: 8.2254, S: 0.12199 },
  { ageMonths: 10, L: -0.17, M: 8.48, S: 0.12223 },
  { ageMonths: 11, L: -0.1872, M: 8.7192, S: 0.12247 },
  { ageMonths: 12, L: -0.2024, M: 8.9481, S: 0.12268 },
  { ageMonths: 13, L: -0.2158, M: 9.1699, S: 0.12283 },
  { ageMonths: 14, L: -0.2278, M: 9.387, S: 0.12294 },
  { ageMonths: 15, L: -0.2384, M: 9.6008, S: 0.12299 },
  { ageMonths: 16, L: -0.2478, M: 9.8124, S: 0.12303 },
  { ageMonths: 17, L: -0.2562, M: 10.0226, S: 0.12306 },
  { ageMonths: 18, L: -0.2637, M: 10.2315, S: 0.12309 },
  { ageMonths: 19, L: -0.2703, M: 10.4393, S: 0.12315 },
  { ageMonths: 20, L: -0.2762, M: 10.6464, S: 0.12323 },
  { ageMonths: 21, L: -0.2815, M: 10.8534, S: 0.12335 },
  { ageMonths: 22, L: -0.2862, M: 11.0608, S: 0.1235 },
  { ageMonths: 23, L: -0.2903, M: 11.2688, S: 0.12369 },
  { ageMonths: 24, L: -0.2941, M: 11.4775, S: 0.1239 }
]

// Helper functions to get WHO weight data by gender
export const getWHOWeightData = (gender: 'male' | 'female') => {
  return gender === 'male' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS
}
