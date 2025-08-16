import { LMSData } from '../types'

// Official WHO Height-for-age standards (0-2 years) - Boys
export const WHO_HEIGHT_BOYS: LMSData[] = [
  // Birth to 24 months (monthly)
  { ageMonths: 0, L: 1.000000, M: 49.884200, S: 0.037950 },
  { ageMonths: 1, L: 1.000000, M: 54.724400, S: 0.035570 },
  { ageMonths: 2, L: 1.000000, M: 58.424900, S: 0.034240 },
  { ageMonths: 3, L: 1.000000, M: 61.429200, S: 0.033280 },
  { ageMonths: 4, L: 1.000000, M: 63.886000, S: 0.032570 },
  { ageMonths: 5, L: 1.000000, M: 65.902600, S: 0.032040 },
  { ageMonths: 6, L: 1.000000, M: 67.623600, S: 0.031650 },
  { ageMonths: 7, L: 1.000000, M: 69.164500, S: 0.031390 },
  { ageMonths: 8, L: 1.000000, M: 70.599400, S: 0.031240 },
  { ageMonths: 9, L: 1.000000, M: 71.968700, S: 0.031170 },
  { ageMonths: 10, L: 1.000000, M: 73.281200, S: 0.031180 },
  { ageMonths: 11, L: 1.000000, M: 74.538800, S: 0.031250 },
  { ageMonths: 12, L: 1.000000, M: 75.748800, S: 0.031370 },
  { ageMonths: 13, L: 1.000000, M: 76.918600, S: 0.031540 },
  { ageMonths: 14, L: 1.000000, M: 78.049700, S: 0.031740 },
  { ageMonths: 15, L: 1.000000, M: 79.145800, S: 0.031970 },
  { ageMonths: 16, L: 1.000000, M: 80.211300, S: 0.032220 },
  { ageMonths: 17, L: 1.000000, M: 81.248700, S: 0.032500 },
  { ageMonths: 18, L: 1.000000, M: 82.258700, S: 0.032790 },
  { ageMonths: 19, L: 1.000000, M: 83.241800, S: 0.033100 },
  { ageMonths: 20, L: 1.000000, M: 84.199600, S: 0.033420 },
  { ageMonths: 21, L: 1.000000, M: 85.134800, S: 0.033760 },
  { ageMonths: 22, L: 1.000000, M: 86.047700, S: 0.034100 },
  { ageMonths: 23, L: 1.000000, M: 86.941000, S: 0.034450 },
  { ageMonths: 24, L: 1.000000, M: 87.816100, S: 0.034790 }
]

// Official WHO Height-for-age standards (0-2 years) - Girls
export const WHO_HEIGHT_GIRLS: LMSData[] = [
  // Birth to 24 months (monthly)
  { ageMonths: 0, L: 1.000000, M: 49.147700, S: 0.037900 },
  { ageMonths: 1, L: 1.000000, M: 53.687200, S: 0.036400 },
  { ageMonths: 2, L: 1.000000, M: 57.067300, S: 0.035680 },
  { ageMonths: 3, L: 1.000000, M: 59.802900, S: 0.035200 },
  { ageMonths: 4, L: 1.000000, M: 62.089900, S: 0.034860 },
  { ageMonths: 5, L: 1.000000, M: 64.030100, S: 0.034630 },
  { ageMonths: 6, L: 1.000000, M: 65.731100, S: 0.034480 },
  { ageMonths: 7, L: 1.000000, M: 67.287300, S: 0.034410 },
  { ageMonths: 8, L: 1.000000, M: 68.749800, S: 0.034400 },
  { ageMonths: 9, L: 1.000000, M: 70.143500, S: 0.034440 },
  { ageMonths: 10, L: 1.000000, M: 71.481800, S: 0.034520 },
  { ageMonths: 11, L: 1.000000, M: 72.771000, S: 0.034640 },
  { ageMonths: 12, L: 1.000000, M: 74.015000, S: 0.034790 },
  { ageMonths: 13, L: 1.000000, M: 75.217600, S: 0.034960 },
  { ageMonths: 14, L: 1.000000, M: 76.381700, S: 0.035140 },
  { ageMonths: 15, L: 1.000000, M: 77.509900, S: 0.035340 },
  { ageMonths: 16, L: 1.000000, M: 78.605500, S: 0.035550 },
  { ageMonths: 17, L: 1.000000, M: 79.671000, S: 0.035760 },
  { ageMonths: 18, L: 1.000000, M: 80.707900, S: 0.035980 },
  { ageMonths: 19, L: 1.000000, M: 81.718200, S: 0.036200 },
  { ageMonths: 20, L: 1.000000, M: 82.703600, S: 0.036430 },
  { ageMonths: 21, L: 1.000000, M: 83.665400, S: 0.036660 },
  { ageMonths: 22, L: 1.000000, M: 84.604000, S: 0.036880 },
  { ageMonths: 23, L: 1.000000, M: 85.520200, S: 0.037110 },
  { ageMonths: 24, L: 1.000000, M: 86.415300, S: 0.037340 }
]

export const getWHOData = (gender: 'male' | 'female') => {
  return gender === 'male' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS
}
