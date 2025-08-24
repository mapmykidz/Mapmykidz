import React, { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CalculationResults, ChartDataPoint, LMSData } from '../types'
  import { getWHOData } from '../data/whoData_height'
import { getCDCData } from '../data/cdcData_height'
import { interpolateLMS, convertHeight } from '../utils/calculations'
import { BarChart3, Eye, Target } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface GrowthChartProps {
  results: CalculationResults
}

  type ChartView = 'standard' | 'genetic'

export const GrowthChart: React.FC<GrowthChartProps> = ({ results }) => {
  const { childData, age, midParentalHeight } = results
  const [chartView, setChartView] = useState<ChartView>('standard')

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

      // Calculate MPH growth curves for ages 2-20
      let mphLine: number | undefined
      let thrLevel1Min: number | undefined
      let thrLevel1Max: number | undefined

      if (usingCDC && ageMonths >= 24) {
        // Calculate MPH growth curve using the MPH Z-score applied to each age point
        const mphZScore = midParentalHeight.mphZScore
        
        // Calculate MPH height at this age using the MPH Z-score
        if (L !== 0) {
          mphLine = M * Math.pow(1 + L * S * mphZScore, 1 / L)
        } else {
          mphLine = M * Math.exp(S * mphZScore)
        }

        // Following the image specification: "Use same SDS score at all age points from 2 until 20 years"
        // Use the pre-calculated Z-scores from MPH calculation (based on 20-year-old standards)
        const level1MinZScore = midParentalHeight.thrLevel1MinZScore
        const level1MaxZScore = midParentalHeight.thrLevel1MaxZScore

        if (L !== 0) {
          thrLevel1Min = M * Math.pow(1 + L * S * level1MinZScore, 1 / L)
          thrLevel1Max = M * Math.pow(1 + L * S * level1MaxZScore, 1 / L)
        } else {
          thrLevel1Min = M * Math.exp(S * level1MinZScore)
          thrLevel1Max = M * Math.exp(S * level1MaxZScore)
        }
      }
      
      const point: ChartDataPoint = {
        age: ageMonths / 12, // Convert to years for display
        percentile3: calculateHeightForPercentile(3),
        percentile10: calculateHeightForPercentile(10),
        percentile25: calculateHeightForPercentile(25),
        percentile50: calculateHeightForPercentile(50),
        percentile75: calculateHeightForPercentile(75),
        percentile90: calculateHeightForPercentile(90),
        percentile97: calculateHeightForPercentile(97),
        mphLine,
        thrLevel1Min,
        thrLevel1Max
      }
      
      data.push(point)
    }
    
    return data
  }, [childData, age, midParentalHeight])

  const childHeightCm = convertHeight(childData.height, childData.heightUnit, 'cm')
  const childAgeYears = age.ageInMonths / 12

  // Generate datasets based on selected view
  const getDatasets = () => {
    const baseDatasets = [
      // Child's measurement (always shown)
      {
        label: `${childData.gender === 'male' ? 'Boy' : 'Girl'}'s ${age.ageInMonths <= 24 ? 'length' : 'height'}`,
        data: chartData.map((point, index) => {
          if (Math.abs(point.age - childAgeYears) < 0.05) {
            const isFirstMatch = chartData.findIndex(p => Math.abs(p.age - childAgeYears) < 0.05) === index;
            return isFirstMatch ? childHeightCm : undefined;
          }
          return undefined
        }),
        backgroundColor: childData.gender === 'male' ? '#1d4ed8' : '#be185d',
        borderColor: childData.gender === 'male' ? '#1d4ed8' : '#be185d',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: childData.gender === 'male' ? '#1d4ed8' : '#be185d',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointStyle: 'circle',
        showLine: false,
        spanGaps: false,
        order: 10,
      }
    ]

    // MPH Target Zones (only for 2-20 years and genetic view)
    const mphZones = age.ageInMonths > 24 && chartView === 'genetic' ? [
      // Red Zone (beyond Target Range) - Separate legend entries
      {
        label: 'Alert Zone (Above)',
        data: chartData.map(point => point.thrLevel1Max).filter(Boolean),
        borderColor: '#dc2626',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: '+1',
        spanGaps: false,
        order: 1,
      },
      {
        label: 'Alert Zone (Below)',
        data: chartData.map(point => point.thrLevel1Min).filter(Boolean),
        borderColor: '#dc2626',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        spanGaps: false,
        order: 1,
      },
      // Green Zone (Target Range)
      {
        label: 'Optimal Zone (Target Range)',
        data: chartData.map(point => point.thrLevel1Min).filter(Boolean),
        borderColor: 'rgba(34, 197, 94, 0.4)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: '+1',
        spanGaps: false,
        order: 3,
      },
      {
        label: 'Optimal Zone (Target Range) max',
        data: chartData.map(point => point.thrLevel1Max).filter(Boolean),
        borderColor: 'rgba(34, 197, 94, 0.4)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        spanGaps: false,
        order: 3,
      },
      // MPH Center Line
      {
        label: 'Mid-parental height',
        data: chartData.map(point => point.mphLine).filter(Boolean),
        borderColor: '#1f2937',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [8, 4],
        pointRadius: 0,
        spanGaps: false,
        order: 4,
      },
    ] : []

    // Percentile lines based on view
    const percentileLines = []
    
    if (chartView === 'standard') {
      // All percentiles
      percentileLines.push(
        {
          label: '97th percentile',
          data: chartData.map(point => point.percentile97),
          borderColor: '#dc2626',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        },
        {
          label: '90th percentile',
          data: chartData.map(point => point.percentile90),
          borderColor: '#ea580c',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        },
        {
          label: '75th percentile',
          data: chartData.map(point => point.percentile75),
          borderColor: '#ca8a04',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        },
        {
          label: '50th percentile',
          data: chartData.map(point => point.percentile50),
          borderColor: '#16a34a',
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        },
        {
          label: '25th percentile',
          data: chartData.map(point => point.percentile25),
          borderColor: '#0891b2',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        },
        {
          label: '10th percentile',
          data: chartData.map(point => point.percentile10),
          borderColor: '#7c3aed',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        },
        {
          label: '3rd percentile',
          data: chartData.map(point => point.percentile3),
          borderColor: '#be123c',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        }
      )
    } else if (chartView === 'genetic') {
      // Only 50th percentile + MPH zones
      percentileLines.push(
        {
          label: '50th percentile',
          data: chartData.map(point => point.percentile50),
          borderColor: '#16a34a',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 5,
        }
      )
    }
    // 'overview' view shows no percentile lines, only MPH zones

    return [...mphZones, ...percentileLines, ...baseDatasets]
  }

  const chartDatasets = {
    labels: chartData.map(point => {
      if (age.ageInMonths > 24) {
        const isWholeYear = Math.abs(point.age - Math.round(point.age)) < 1e-6
        return isWholeYear ? Math.round(point.age).toString() : ''
      } else {
        const months = Math.round(point.age * 12)
        return months.toString()
      }
    }),
    datasets: getDatasets()
  }

  const getChartTitle = () => {
    switch (chartView) {
      case 'standard':
        return `${age.ageInMonths <= 24 ? 'Length' : 'Height'}-for-Age Chart - ${childData.gender === 'male' ? 'Boys' : 'Girls'} (Standard View)`
      case 'genetic':
        return `${age.ageInMonths <= 24 ? 'Length' : 'Height'}-for-Age Chart - ${childData.gender === 'male' ? 'Boys' : 'Girls'} (Genetic Potential View)`
      default:
        return `${age.ageInMonths <= 24 ? 'Length' : 'Height'}-for-Age Chart - ${childData.gender === 'male' ? 'Boys' : 'Girls'}`
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: getChartTitle(),
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
            const hiddenLabels = [
              'Alert Zone (beyond Target Range) min',
              'Optimal Zone (Target Range) max'
            ]
            // Hide zone-related legend items in standard view
            if (chartView === 'standard') {
              const zoneLabels = [
                'Alert Zone (beyond Target Range)',
                'Alert Zone (beyond Target Range) min',
                'Optimal Zone (Target Range)',
                'Optimal Zone (Target Range) max',
                'Mid-parental height'
              ]
              return !zoneLabels.includes(legendItem.text || '')
            }
            return !hiddenLabels.includes(legendItem.text || '')
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
        beginAtZero: false,
        min: age.ageInMonths > 24 ? 80 : undefined, // Start from 80 cm for 2-20 years
        max: age.ageInMonths > 24 ? 200 : undefined  // End at 200 cm for 2-20 years
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <div className="w-full">
      {/* View Toggle Buttons */}
      {age.ageInMonths > 24 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Chart View:</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartView('standard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartView === 'standard'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Standard Growth</span>
            </button>
            <button
              onClick={() => setChartView('genetic')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartView === 'genetic'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Genetic Potential</span>
            </button>
          </div>
        </div>
      )}

      <div className="h-[450px] sm:h-[500px] md:h-[550px] lg:h-[500px]">
        <Line data={chartDatasets} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium">Chart Standard:</span> {results.growthResult.standard} 
          {results.growthResult.standard === 'WHO' && ' (0-2 years)'}
          {results.growthResult.standard === 'CDC' && ' (2-20 years)'}
        </p>
        <p>
            The {childData.gender === 'male' ? 'blue' : 'pink'} dot shows your child's current {age.ageInMonths <= 24 ? 'length' : 'height'}. 
            {chartView === 'standard' && ' Percentile lines show the distribution of heights for children of the same age and gender.'}
            {chartView === 'genetic' && ' The 50th percentile line shows average growth, while the MPH zones show your child\'s genetic potential.'}
        </p>
        {age.ageInMonths > 24 && chartView === 'genetic' && (
          <div className="space-y-1">
            <p>
              The <strong>dashed black line</strong> shows the mid-parental height growth curve based on your child's genetic potential.
            </p>
            <p>
              <span className="text-green-600 font-medium">Green zone:</span> Optimal growth range (Target Range)
            </p>
            <p>
              <span className="text-red-600 font-medium">Red zone:</span> Beyond Target Range
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
