import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CalculationResults, ChartDataPoint, LMSData } from '../types'
  import { getWHOData } from '../data/whoData_height'
import { getCDCData } from '../data/cdcData_height'
import { interpolateLMS, convertHeight } from '../utils/calculations'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface GrowthChartProps {
  results: CalculationResults
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ results }) => {
  const { childData, age, midParentalHeight } = results

  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = []
    
    // Determine age range for chart
    const currentAgeMonths = age.ageInMonths
    let startAge: number
    let endAge: number
    
    // If using CDC standards (2+ years), show full 2-20 year range
    if (currentAgeMonths > 24) {
      startAge = 24 // Start exactly at 2 years (24 months)
      endAge = 240  // End exactly at 20 years (240 months)
      } else {
      // For WHO standards (0-2 years), show full 0-2 year range
      startAge = 0  // Start at birth (0 months)
      endAge = 24   // End at 2 years (24 months)
    }

    // Get appropriate data source
    const whoData = getWHOData(childData.gender)
    const cdcData = getCDCData(childData.gender)
    
    // Generate chart points
    let stepSize: number
    if (currentAgeMonths > 24) {
      // For CDC charts (2-20 years), generate monthly points so the child's age (in months) is always present
      // The x-axis labels are still rendered as whole years below, so visual density remains reasonable
      stepSize = 1
      } else {
      // For WHO charts (0-2 years), generate monthly points and label the x-axis in months (0–24)
      stepSize = 1
    }
    
    const usingCDC = currentAgeMonths > 24
    for (let ageMonths = startAge; ageMonths <= endAge; ageMonths += stepSize) {
      // Use a single standard consistently across the displayed range
      // - WHO mode: 0–24 months, WHO data throughout
      // - CDC mode: 24–240 months, CDC data throughout (including exactly 24)
      const lmsData: LMSData[] = usingCDC ? cdcData : whoData
      
      const interpolated = interpolateLMS(ageMonths, lmsData)
      if (!interpolated) continue
      
      const { L, M, S } = interpolated
      
      // Calculate heights for different percentiles using fixed z-scores
      // These z values are exact standard normal quantiles for commonly used percentiles
      const calculateHeightForPercentile = (percentile: number): number => {
        let z: number
        switch (percentile) {
          case 3:
            z = -1.8807936081512509
            break
          case 10:
            z = -1.2815515655446004
            break
          case 25:
            z = -0.6744897501960817
            break
          case 50:
            z = 0
            break
          case 75:
            z = 0.6744897501960817
            break
          case 90:
            z = 1.2815515655446004
            break
          case 97:
            z = 1.8807936081512509
            break
          default:
            // Fallback: approximate by scaling to nearest supported percentile
            const supported = [3, 10, 25, 50, 75, 90, 97]
            const nearest = supported.reduce((a, b) => Math.abs(b - percentile) < Math.abs(a - percentile) ? b : a, 50)
            return calculateHeightForPercentile(nearest)
        }

        if (L !== 0) {
          return M * Math.pow(1 + L * S * z, 1 / L)
        }
          return M * Math.exp(S * z)
      }
      
      const point: ChartDataPoint = {
        age: ageMonths / 12, // Convert to years for display
        percentile3: calculateHeightForPercentile(3),
        percentile10: calculateHeightForPercentile(10),
        percentile25: calculateHeightForPercentile(25),
        percentile50: calculateHeightForPercentile(50),
        percentile75: calculateHeightForPercentile(75),
        percentile90: calculateHeightForPercentile(90),
        percentile97: calculateHeightForPercentile(97)
      }
      
      // Add mid-parental height line (only for ages 18-20)
      if (ageMonths >= 216) { // 18 years
        point.mphLine = midParentalHeight.mph
        point.thrLevel1Min = midParentalHeight.thrLevel1Min
        point.thrLevel1Max = midParentalHeight.thrLevel1Max
        point.thrLevel2Min = midParentalHeight.thrLevel2Min
        point.thrLevel2Max = midParentalHeight.thrLevel2Max
      }
      
      data.push(point)
    }
    
    return data
  }, [childData, age, midParentalHeight])

  const childHeightCm = convertHeight(childData.height, childData.heightUnit, 'cm')
  const childAgeYears = age.ageInMonths / 12

  const chartDatasets = {
    labels: chartData.map(point => {
      // For CDC charts (ages 2-20), only label whole years to avoid clutter
      if (age.ageInMonths > 24) {
        const isWholeYear = Math.abs(point.age - Math.round(point.age)) < 1e-6
        return isWholeYear ? Math.round(point.age).toString() : ''
      } else {
        // For WHO charts (0-2 years), label in months (0–24)
        const months = Math.round(point.age * 12)
        return months.toString()
      }
    }),
    datasets: [
      // Percentile lines
      {
        label: '97th percentile',
        data: chartData.map(point => point.percentile97),
        borderColor: '#dc2626',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: '90th percentile',
        data: chartData.map(point => point.percentile90),
        borderColor: '#ea580c',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: '75th percentile',
        data: chartData.map(point => point.percentile75),
        borderColor: '#ca8a04',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: '50th percentile',
        data: chartData.map(point => point.percentile50),
        borderColor: '#16a34a',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: '25th percentile',
        data: chartData.map(point => point.percentile25),
        borderColor: '#0891b2',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: '10th percentile',
        data: chartData.map(point => point.percentile10),
        borderColor: '#7c3aed',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: '3rd percentile',
        data: chartData.map(point => point.percentile3),
        borderColor: '#be123c',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      // Mid-parental height line
      {
        label: 'Mid-parental height',
        data: chartData.map(point => point.mphLine).filter(Boolean),
        borderColor: '#1f2937',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        spanGaps: false,
      },
      // Target height ranges
      {
        label: 'Target range (Level 1)',
        data: chartData.map(point => point.thrLevel1Max).filter(Boolean),
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderWidth: 1,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: '+1',
        spanGaps: false,
      },
      {
        label: 'Target range (Level 1) min',
        data: chartData.map(point => point.thrLevel1Min).filter(Boolean),
        borderColor: '#6b7280',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [3, 3],
        pointRadius: 0,
        spanGaps: false,
      },
      // Child's measurement
      {
        label: `${childData.gender === 'male' ? 'Boy' : 'Girl'}'s height`,
        data: chartData.map((point, index) => {
          // Show only ONE point at the child's exact age with reasonable tolerance
          if (Math.abs(point.age - childAgeYears) < 0.05) {
            // Only return the value for the first match to prevent multiple points
            const isFirstMatch = chartData.findIndex(p => Math.abs(p.age - childAgeYears) < 0.05) === index;
            return isFirstMatch ? childHeightCm : undefined;
          }
          return undefined
        }),
        backgroundColor: childData.gender === 'male' ? '#1d4ed8' : '#be185d', // darker blue/pink for better contrast
        borderColor: childData.gender === 'male' ? '#1d4ed8' : '#be185d', // darker blue/pink for better contrast
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: childData.gender === 'male' ? '#1d4ed8' : '#be185d',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointStyle: 'circle',
        showLine: false,
        spanGaps: false, // Prevent line rendering between points
        fill: false, // Ensure no fill
      },
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${age.ageInMonths <= 24 ? 'Length' : 'Height'}-for-Age Chart - ${childData.gender === 'male' ? 'Boys' : 'Girls'}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          },
          filter: (legendItem) => {
            // Hide some labels to reduce clutter
            return !['Target range (Level 1) min'].includes(legendItem.text || '')
          }
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `Age: ${context[0].label} years`
          },
          label: (context) => {
            const value = typeof context.parsed.y === 'number' ? context.parsed.y.toFixed(1) : context.parsed.y
            return `${context.dataset.label}: ${value} cm`
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: age.ageInMonths > 24 ? 'Age (years)' : 'Age (months)',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
              y: {
          title: {
            display: true,
            text: `${age.ageInMonths <= 24 ? 'Length' : 'Height'} (cm)`,
            font: {
              weight: 'bold'
            }
          },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        beginAtZero: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <div className="w-full">
      <div className="h-96 md:h-[500px]">
        <Line data={chartDatasets} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium">Chart Standard:</span> {results.growthResult.standard} 
          {results.growthResult.standard === 'WHO' && ' (0-2 years)'}
          {results.growthResult.standard === 'CDC' && ' (2-20 years)'}
        </p>
        <p>
            The {childData.gender === 'male' ? 'blue' : 'pink'} dot shows your child's current {age.ageInMonths <= 24 ? 'length' : 'height'}. Percentile lines show the distribution of {age.ageInMonths <= 24 ? 'lengths' : 'heights'} for children of the same age and gender.
        </p>
        {age.ageInMonths >= 216 && (
          <p>
            The dashed black line shows the mid-parental height, and the shaded area shows the expected target height range.
          </p>
        )}
      </div>
    </div>
  )
}
