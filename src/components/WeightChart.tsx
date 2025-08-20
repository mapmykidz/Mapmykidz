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
import { getWHOWeightData } from '../data/whoData_weight'
import { getCDCWeightData } from '../data/cdcData_weight'
import { interpolateLMS, convertWeight } from '../utils/calculations'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface WeightChartProps {
  results: CalculationResults
}

export const WeightChart: React.FC<WeightChartProps> = ({ results }) => {
  const { childData, age } = results

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
    const whoData = getWHOWeightData(childData.gender)
    const cdcData = getCDCWeightData(childData.gender)
    
    // Generate chart points
    let stepSize: number
    if (currentAgeMonths > 24) {
      // For CDC charts (2-20 years), generate monthly points
      stepSize = 1
    } else {
      // For WHO charts (0-2 years), generate monthly points
      stepSize = 1
    }
    
    const usingCDC = currentAgeMonths > 24
    for (let ageMonths = startAge; ageMonths <= endAge; ageMonths += stepSize) {
      // Use a single standard consistently across the displayed range
      const lmsData: LMSData[] = usingCDC ? cdcData : whoData
      
      const interpolated = interpolateLMS(ageMonths, lmsData)
      if (!interpolated) continue
      
      const { L, M, S } = interpolated
      
      // Calculate weights for different percentiles using fixed z-scores
      const calculateWeightForPercentile = (percentile: number): number => {
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
            return calculateWeightForPercentile(nearest)
        }

        if (L !== 0) {
          return M * Math.pow(1 + L * S * z, 1 / L)
        }
        return M * Math.exp(S * z)
      }
      
      const point: ChartDataPoint = {
        age: ageMonths / 12, // Convert to years for display
        percentile3: calculateWeightForPercentile(3),
        percentile10: calculateWeightForPercentile(10),
        percentile25: calculateWeightForPercentile(25),
        percentile50: calculateWeightForPercentile(50),
        percentile75: calculateWeightForPercentile(75),
        percentile90: calculateWeightForPercentile(90),
        percentile97: calculateWeightForPercentile(97)
      }
      
      data.push(point)
    }
    
    return data
  }, [childData, age])

  const childWeightKg = childData.weight && childData.weightUnit ? 
    convertWeight(childData.weight, childData.weightUnit, 'kg') : 0
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
      // Child's measurement
      {
        label: `${childData.gender === 'male' ? 'Boy' : 'Girl'}'s weight`,
        data: chartData.map((point, index) => {
          // Show only ONE point at the child's exact age with reasonable tolerance
          if (Math.abs(point.age - childAgeYears) < 0.05) {
            // Only return the value for the first match to prevent multiple points
            const isFirstMatch = chartData.findIndex(p => Math.abs(p.age - childAgeYears) < 0.05) === index;
            return isFirstMatch ? childWeightKg : undefined;
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
        fill: false,
      },
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Weight-for-Age Chart - ${childData.gender === 'male' ? 'Boys' : 'Girls'}`,
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
          }
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `Age: ${context[0].label} years`
          },
          label: (context) => {
            const value = typeof context.parsed.y === 'number' ? context.parsed.y.toFixed(2) : context.parsed.y
            return `${context.dataset.label}: ${value} kg`
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
          text: 'Weight (kg)',
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
      <div className="h-[450px] sm:h-[500px] md:h-[550px] lg:h-[500px]">
        <Line data={chartDatasets} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium">Chart Standard:</span> {age.ageInMonths <= 24 ? 'WHO' : 'CDC'} 
          {age.ageInMonths <= 24 && ' (0-2 years)'}
          {age.ageInMonths > 24 && ' (2-20 years)'}
        </p>
        <p>
          The {childData.gender === 'male' ? 'blue' : 'pink'} dot shows your child's current weight. 
          Percentile lines show the distribution of weights for children of the same age and gender.
        </p>
      </div>
    </div>
  )
}
