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
import { getWHOWeightForLengthData } from '../data/whoData_weightforHeight'
import { CalculationResults } from '../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  length: number
  percentile3: number
  percentile10: number
  percentile25: number
  percentile50: number
  percentile75: number
  percentile90: number
  percentile97: number
}

interface WeightForLengthChartProps {
  results: CalculationResults
}

export const WeightForLengthChart: React.FC<WeightForLengthChartProps> = ({ results }) => {
  const { childData } = results

  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = []
    
    // Weight-for-length charts are only for children 0-2 years (WHO standards)
    // Length range: 45-110 cm (0.5 cm increments)
    const startLength = 45
    const endLength = 110
    const stepSize = 0.5
    
    // Get WHO weight-for-length data
    const wflData = getWHOWeightForLengthData(childData.gender)
    
    // Generate chart points
    for (let length = startLength; length <= endLength; length += stepSize) {
      // Find the closest length value in the data
      const interpolated = interpolateWFL(length, wflData)
      if (!interpolated) continue
      
      const { L, M, S } = interpolated
      
      // Calculate weight for each percentile using fixed z-scores
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
        length: length,
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
  }, [childData.gender])

  // Calculate child's weight and length
  const childWeight = childData.weight ? 
    (childData.weightUnit === 'kg' ? childData.weight : childData.weight * 0.45359237) : 0
  const childLength = childData.height ? 
    (childData.heightUnit === 'cm' ? childData.height : childData.height * 2.54) : 0

  const chartDatasets = {
    labels: chartData.map(point => point.length.toString()),
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
          // Show only ONE point at the child's exact length with reasonable tolerance
          if (Math.abs(point.length - childLength) < 0.5) {
            // Only return the value for the first match to prevent multiple points
            const isFirstMatch = chartData.findIndex(p => Math.abs(p.length - childLength) < 0.5) === index;
            return isFirstMatch ? childWeight : undefined;
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
        text: `Weight-for-Length Chart - ${childData.gender === 'male' ? 'Boys' : 'Girls'}`,
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
            return `Length: ${context[0].label} cm`
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
          text: 'Length (cm)',
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
          <span className="font-medium">Chart Standard:</span> WHO (0-2 years)
        </p>
        <p>
          The {childData.gender === 'male' ? 'blue' : 'pink'} dot shows your child's current weight. 
          Percentile lines show the distribution of weights for children of the same length and gender.
        </p>
      </div>
    </div>
  )
}

// Helper function to interpolate weight-for-length data
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

