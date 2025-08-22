import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, ArrowLeft, Calculator, TrendingUp, Users, AlertTriangle, CheckCircle, Info, Download, Ruler, Scale, Activity } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { convertHeight, convertWeight, calculateWeightPercentile, calculateBMI, calculateBMIPercentile, calculateWeightForLengthPercentile, interpolateLMS } from '../utils/calculations'
import { getCDCData } from '../data/cdcData_height'
import { GrowthChart } from '../components/GrowthChart'
import { WeightChart } from '../components/WeightChart'
import { BMChart } from '../components/BMChart'
import { WeightForLengthChart } from '../components/WeightForLengthChart'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { results, resetForNewCalculation } = useAppStore()
  const [activeTab, setActiveTab] = useState<'height' | 'weight' | 'bmi'>('height')

  if (!results) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Results Available</h1>
        <p className="text-gray-600 mb-6">
          Please complete the growth calculation first.
        </p>
        <Link to="/input" className="btn-primary">
          Start Calculation
        </Link>
      </div>
    )
  }

  const { childData, age, growthResult, midParentalHeight } = results
  
  // Calculate weight results if weight is provided
  const weightResult = childData.weight && childData.weightUnit ? 
    calculateWeightPercentile(
      convertWeight(childData.weight, childData.weightUnit, 'kg'),
      age.ageInMonths,
      childData.gender
    ) : null

  // Calculate BMI or weight-for-length results if both weight and height are provided
  const bmiResult = childData.weight && childData.weightUnit && childData.height && childData.heightUnit ? 
    (age.ageInMonths <= 24 ? 
      // For children 0-2 years, use weight-for-length
      calculateWeightForLengthPercentile(
        convertWeight(childData.weight, childData.weightUnit, 'kg'),
        convertHeight(childData.height, childData.heightUnit, 'cm'),
        childData.gender
      ) :
      // For children 2+ years, use BMI
    calculateBMIPercentile(
      calculateBMI(
        convertWeight(childData.weight, childData.weightUnit, 'kg'),
        convertHeight(childData.height, childData.heightUnit, 'cm')
      ),
      age.ageInMonths,
      childData.gender
      )
    ) : null
  
  // Function to get MPH-based height recommendation for children 2+ years
  const getMPHHeightRecommendation = () => {
    // Only for children 2+ years (CDC standards) where MPH is applicable
    if (age.ageInMonths <= 24 || !midParentalHeight) {
      return null
    }

    const childHeightCm = convertHeight(childData.height, childData.heightUnit, 'cm')
    
    // Calculate MPH at current age using the same method as the chart
    // Get CDC data for the child's gender
    const cdcData = getCDCData(childData.gender)
    
    // Get LMS values for the child's current age
    const lmsData = interpolateLMS(age.ageInMonths, cdcData)
    if (!lmsData) {
      return null
    }
    
    const { L, M, S } = lmsData
    
    // Calculate target range using the pre-calculated Z-scores
    const level1MinZScore = midParentalHeight.thrLevel1MinZScore
    const level1MaxZScore = midParentalHeight.thrLevel1MaxZScore
    
    let level1Min: number, level1Max: number
    if (L !== 0) {
      level1Min = M * Math.pow(1 + L * S * level1MinZScore, 1 / L)
      level1Max = M * Math.pow(1 + L * S * level1MaxZScore, 1 / L)
    } else {
      level1Min = M * Math.exp(S * level1MinZScore)
      level1Max = M * Math.exp(S * level1MaxZScore)
    }
    
    // Calculate if child's height is within target range
    const isWithinTargetRange = childHeightCm >= level1Min && childHeightCm <= level1Max

    if (isWithinTargetRange) {
      return {
        message: "Your child's height is within the target range - normal.",
        color: 'bg-green-50 border-green-400',
        textColor: 'text-green-800'
      }
    } else {
      return {
        message: "Your child's height is outside the target height range - recommended to see a pediatrician or pediatric endocrinologist.",
        color: 'bg-red-50 border-red-400', 
        textColor: 'text-red-800'
      }
    }
  }
  
  // Get selected measurements from child data
  const selectedMeasurements = childData.selectedMeasurements || ['height']
  
  // Filter available tabs based on selected measurements
  const availableTabs = selectedMeasurements.filter(m => m === 'height' || m === 'weight' || m === 'bmi') as ('height' | 'weight' | 'bmi')[]
  
  // Set default active tab to first available
  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0])
    }
  }, [availableTabs, activeTab])

  const handleNewCalculation = () => {
    resetForNewCalculation()
    navigate('/input')
  }

  const handleExportPDF = async () => {
    try {
      // First, capture the chart
      const chartElement = document.querySelector('.h-96.md\\:h-\\[500px\\] canvas') || 
                          document.querySelector('canvas')
      
      if (!chartElement) {
        alert('Chart not found. Please ensure the chart is loaded before exporting.')
        return
      }
      
      // Convert chart to image
      const chartCanvas = chartElement as HTMLCanvasElement
      const chartImageData = chartCanvas.toDataURL('image/png')
      
             // Create a temporary div for PDF content
       const pdfContent = document.createElement('div')
       pdfContent.style.width = '800px'
       pdfContent.style.padding = '15px'
       pdfContent.style.backgroundColor = 'white'
       pdfContent.style.color = 'black'
       pdfContent.style.fontFamily = 'Arial, sans-serif'
      
      // Add header
      pdfContent.innerHTML = `
                 <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #10b981; padding-bottom: 15px;">
           <h1 style="color: #10b981; margin: 0; font-size: 28px;">MapMyKidz Growth Report</h1>
           <p style="color: #6b7280; margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()}</p>
         </div>
        
                 <div style="margin-bottom: 20px;">
           <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Child Information</h2>
           <div style="margin-top: 12px;">
             <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
               <span><strong>Gender:</strong> ${childData.gender === 'male' ? 'Boy' : 'Girl'}</span>
               <span><strong>Age:</strong> ${formatAge()}</span>
             </div>
             <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
               <span><strong>Height:</strong> ${childData.height} ${childData.heightUnit} (${convertHeight(childData.height, childData.heightUnit, 'cm').toFixed(1)} cm)</span>
               <span><strong>Measurement Date:</strong> ${new Date(childData.measurementDate).toLocaleDateString()}</span>
             </div>
           </div>
         </div>
        
                 <div style="margin-bottom: 20px;">
           <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Growth Results</h2>
           <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 12px;">
             <div style="display: flex; justify-content: space-between; align-items: flex-start;">
               <div style="flex: 1;">
                 <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Percentile</div>
                 <div style="font-size: 32px; font-weight: bold; color: ${getPercentileColor(growthResult.percentile)};">
                   ${growthResult.percentile >= 3 ? `${growthResult.percentile.toFixed(1)}th` : '<3rd'}
                 </div>
                 <div style="font-size: 12px; color: #6b7280;">${growthResult.standard} Standard</div>
               </div>
               ${growthResult.percentile < 3 ? `
                 <div style="flex: 1; text-align: right;">
                   <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Z-Score</div>
                   <div style="font-size: 32px; font-weight: bold; color: #374151;">${growthResult.zScore.toFixed(2)}</div>
                   <div style="font-size: 12px; color: #6b7280;">Standard deviations</div>
                 </div>
               ` : ''}
             </div>
             <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
               <div style="font-weight: bold; margin-bottom: 8px;">Interpretation:</div>
               <div style="line-height: 1.4;">${growthResult.interpretation}</div>
             </div>
           </div>
         </div>
        
                 <div style="margin-bottom: 20px;">
           <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Growth Chart</h2>
           <div style="text-align: center; margin-top: 12px;">
             <img src="${chartImageData}" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px;" alt="Growth Chart" />
             <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">
               The ${childData.gender === 'male' ? 'blue' : 'pink'} dot shows your child's current height. 
               Percentile lines show the distribution of heights for children of the same age and gender.
             </p>
           </div>
         </div>
        
                 <div style="margin-bottom: 30px;">
           <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Mid-Parental Height</h2>
           <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 15px;">
             <div style="text-align: center; margin-bottom: 20px;">
               <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Expected Adult Height</div>
               <div style="font-size: 28px; font-weight: bold; color: #0369a1;">${midParentalHeight.mph.toFixed(1)} cm</div>
               <div style="font-size: 12px; color: #6b7280;">(${convertHeight(midParentalHeight.mph, 'cm', 'inches').toFixed(1)} inches)</div>
             </div>
             <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 15px;">
               <div style="flex: 1;">
                 <strong>Target Range:</strong><br/>
                 ${midParentalHeight.thrLevel1Min.toFixed(1)} - ${midParentalHeight.thrLevel1Max.toFixed(1)} cm
               </div>
             </div>
             <div style="text-align: center; font-size: 12px; color: #6b7280;">
               <strong>Mother:</strong> ${childData.motherHeight} ${childData.motherHeightUnit} | 
               <strong>Father:</strong> ${childData.fatherHeight} ${childData.fatherHeightUnit}
             </div>
           </div>
         </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Recommendations</h2>
          <div style="background: ${growthResult.isNormal ? '#f0fdf4' : '#fef3c7'}; padding: 20px; border-radius: 8px; margin-top: 15px; border-left: 4px solid ${growthResult.isNormal ? '#10b981' : '#f59e0b'};">
            <div style="font-weight: bold; margin-bottom: 10px; color: ${growthResult.isNormal ? '#065f46' : '#92400e'};">
              ${growthResult.isNormal ? '✓ Normal Growth' : '⚠ Growth Monitoring Recommended'}
            </div>
            <div style="line-height: 1.5; color: ${growthResult.isNormal ? '#065f46' : '#92400e'};">
              ${growthResult.advice}
            </div>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
          <p><strong>Medical Disclaimer:</strong> This report is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for medical concerns.</p>
          <p style="margin-top: 10px;">Generated by MapMyKidz - Child Growth Tracker</p>
        </div>
      `
      
      // Temporarily add to document for rendering
      document.body.appendChild(pdfContent)
      
      // Convert to canvas
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      // Remove from document
      document.body.removeChild(pdfContent)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Download PDF
      const fileName = `MapMyKidz_${childData.gender === 'male' ? 'Boy' : 'Girl'}_${formatAge().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const formatAge = () => {
    if (age.ageYears === 0) {
      return `${age.ageMonths} months old`
    } else if (age.ageMonths === 0) {
      return `${age.ageYears} years old`
    } else {
      return `${age.ageYears} years, ${age.ageMonths} months old`
    }
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile < 3) return 'text-red-600'
    if (percentile < 10) return 'text-orange-600'
    if (percentile > 97) return 'text-blue-600'
    if (percentile > 90) return 'text-green-600'
    return 'text-gray-900'
  }

  const getPercentileIcon = (isNormal: boolean) => {
    return isNormal ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-orange-500" />
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/input')}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Growth Results</h1>
            <p className="text-gray-600">
              {childData.gender === 'male' ? 'Boy' : 'Girl'}, {formatAge()}
            </p>
          </div>
        </div>
        <button
          onClick={handleNewCalculation}
          className="btn-secondary inline-flex items-center space-x-2"
        >
          <Calculator className="w-4 h-4" />
          <span>New Calculation</span>
        </button>
      </div>

      {/* Measurement Tabs */}
      {availableTabs.length > 1 && (
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'height' && <Ruler className="w-4 h-4" />}
                {tab === 'weight' && <Scale className="w-4 h-4" />}
                {tab === 'bmi' && <Activity className="w-4 h-4" />}
                <span className={tab === 'bmi' && age.ageInMonths <= 24 ? 'normal-case' : (tab === 'bmi' ? 'uppercase' : 'capitalize')}>
                  {tab === 'bmi' && age.ageInMonths <= 24 ? 'Weight-for-Length' : tab}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Content based on active tab */}
          {activeTab === 'height' && (
            <>
              {/* Height Growth Percentile */}
          <div className="result-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Height-for-age Percentile</h2>
              </div>
              {getPercentileIcon(growthResult.isNormal)}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 border border-primary-200">
                <div className="text-sm text-gray-600 mb-1">Percentile</div>
                <div className={`text-3xl font-bold ${getPercentileColor(growthResult.percentile)}`}>
                  {growthResult.percentile >= 3 
                    ? `${growthResult.percentile.toFixed(1)}th` 
                    : `<3rd`
                  }
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {growthResult.standard} Standard
                </div>
              </div>
              
                <div className="bg-white rounded-lg p-4 border border-primary-200">
                  <div className="text-sm text-gray-600 mb-1">Z-Score</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {growthResult.zScore.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Standard deviations
                  </div>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-2">Interpretation</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {growthResult.interpretation}
              </p>
            </div>
          </div>

              {/* Height Growth Chart */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Height Growth Chart</h2>
            </div>
            <GrowthChart results={results} />
          </div>

              {/* Height Advice Section */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Height Recommendations</h2>
            </div>
            <div className={`p-4 rounded-lg border-l-4 ${
              growthResult.isNormal 
                ? 'bg-green-50 border-green-400' 
                : 'bg-orange-50 border-orange-400'
            }`}>
              <p className="text-gray-700">
                {growthResult.advice}
              </p>
            </div>
            
            {/* MPH-based Height Recommendation for children 2+ years */}
            {getMPHHeightRecommendation() && (
              <div className={`p-4 rounded-lg border-l-4 mt-4 ${getMPHHeightRecommendation()?.color}`}>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Genetic Potential Assessment</h4>
                  <p className={`${getMPHHeightRecommendation()?.textColor}`}>
                    {getMPHHeightRecommendation()?.message}
                  </p>
                </div>
              </div>
            )}
          </div>
            </>
          )}

          {activeTab === 'weight' && weightResult && (
            <>
              {/* Weight Growth Percentile */}
              <div className="result-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Weight-for-age Percentile</h2>
                  </div>
                  {getPercentileIcon(weightResult.isNormal)}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="text-sm text-gray-600 mb-1">Percentile</div>
                    <div className={`text-3xl font-bold ${getPercentileColor(weightResult.percentile)}`}>
                      {weightResult.percentile >= 3 
                        ? `${weightResult.percentile.toFixed(1)}th` 
                        : `<3rd`
                      }
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {weightResult.standard} Standard
                    </div>
                  </div>
                  
                    <div className="bg-white rounded-lg p-4 border border-primary-200">
                      <div className="text-sm text-gray-600 mb-1">Z-Score</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {weightResult.zScore.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Standard deviations
                      </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-primary-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Interpretation</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {weightResult.interpretation}
                  </p>
                </div>
              </div>

              {/* Weight Growth Chart */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Weight Growth Chart</h2>
                </div>
                <WeightChart results={results} />
              </div>

              {/* Weight Advice Section */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <Info className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Weight Recommendations</h2>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${
                  weightResult.isNormal 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-orange-50 border-orange-400'
                }`}>
                  <p className="text-gray-700">
                    {weightResult.advice}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'weight' && !weightResult && (
            <>
              {/* Weight Growth Percentile - No Data */}
              <div className="result-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Weight-for-age Percentile</h2>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="text-yellow-800">
                    <Scale className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                    <h3 className="text-lg font-semibold mb-2">Weight Data Required</h3>
                    <p className="text-sm">
                      Please provide weight information to view weight percentile analysis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Weight Growth Chart - No Data */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Weight Growth Chart</h2>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-gray-600">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Weight Data Required</h3>
                    <p className="text-sm">
                      Please provide weight information to view weight growth chart.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bmi' && bmiResult && (
            <>
              {/* BMI Analysis */}
              <div className="result-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {age.ageInMonths <= 24 ? 'Weight-for-Length Analysis' : 'BMI Analysis'}
                    </h2>
                  </div>
                  {getPercentileIcon(bmiResult.isNormal)}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <div className="text-sm text-gray-600 mb-1">Percentile</div>
                    <div className={`text-3xl font-bold ${getPercentileColor(bmiResult.percentile)}`}>
                      {bmiResult.percentile >= 3 
                        ? `${bmiResult.percentile.toFixed(1)}th` 
                        : `<3rd`
                      }
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {bmiResult.standard} Standard
                    </div>
                  </div>
                  
                    <div className="bg-white rounded-lg p-4 border border-primary-200">
                      <div className="text-sm text-gray-600 mb-1">Z-Score</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {bmiResult.zScore.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Standard deviations
                      </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-primary-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Interpretation</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {bmiResult.interpretation}
                  </p>
                </div>
              </div>

              {/* BMI or Weight-for-Length Chart */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {age.ageInMonths <= 24 ? 'Weight-for-Length Growth Chart' : 'BMI Growth Chart'}
                  </h2>
                </div>
                {age.ageInMonths <= 24 ? (
                  <WeightForLengthChart results={results} />
                ) : (
                <BMChart results={results} />
                )}
              </div>

              {/* BMI Advice Section */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <Info className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {age.ageInMonths <= 24 ? 'Weight-for-Length Recommendations' : 'BMI Recommendations'}
                  </h2>
                </div>
                <div className={`p-4 rounded-lg border-l-4 ${
                  bmiResult.isNormal 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-orange-50 border-orange-400'
                }`}>
                  <p className="text-gray-700">
                    {bmiResult.advice}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bmi' && !bmiResult && (
            <>
              {/* BMI Analysis - No Data */}
              <div className="result-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {age.ageInMonths <= 24 ? 'Weight-for-Length Analysis' : 'BMI Analysis'}
                  </h2>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-blue-800">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">
                      {age.ageInMonths <= 24 ? 'Weight-for-Length Data Required' : 'BMI Data Required'}
                    </h3>
                    <p className="text-sm">
                      Please provide both height and weight information to view {age.ageInMonths <= 24 ? 'weight-for-length' : 'BMI'} analysis.
                    </p>
                  </div>
                </div>
              </div>

              {/* BMI Chart - No Data */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {age.ageInMonths <= 24 ? 'Weight-for-Length Growth Chart' : 'BMI Growth Chart'}
                  </h2>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-gray-600">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      {age.ageInMonths <= 24 ? 'Weight-for-Length Data Required' : 'BMI Data Required'}
                    </h3>
                    <p className="text-sm">
                      Please provide both height and weight information to view {age.ageInMonths <= 24 ? 'weight-for-length' : 'BMI'} growth chart.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Child Info Summary */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Child Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{childData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{formatAge()}</span>
              </div>
              {selectedMeasurements.includes('height') && (
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">
                  {childData.height} {childData.heightUnit}
                  {childData.heightUnit !== 'cm' && (
                    <span className="text-gray-500 ml-1">
                      ({convertHeight(childData.height, childData.heightUnit, 'cm').toFixed(1)} cm)
                    </span>
                  )}
                </span>
              </div>
              )}
              {selectedMeasurements.includes('weight') && childData.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">
                    {childData.weight} {childData.weightUnit}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Measurement:</span>
                <span className="font-medium">
                  {new Date(childData.measurementDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Mid-Parental Height - Only show for height tab */}
          {activeTab === 'height' && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Mid-Parental Height</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <div className="text-sm text-gray-600 mb-1">Expected Adult Height</div>
                <div className="text-2xl font-bold text-primary-700">
                  {midParentalHeight.mph.toFixed(1)} cm
                </div>
                <div className="text-sm text-gray-500">
                  ({convertHeight(midParentalHeight.mph, 'cm', 'inches').toFixed(1)} inches)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Z-score: {midParentalHeight.mphZScore.toFixed(2)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Target Range</div>
                  <div className="text-sm text-gray-600">
                    {midParentalHeight.thrLevel1Min.toFixed(1)} - {midParentalHeight.thrLevel1Max.toFixed(1)} cm
                  </div>
                  <div className="text-xs text-gray-500">
                    Z-scores: {midParentalHeight.thrLevel1MinZScore.toFixed(2)} to {midParentalHeight.thrLevel1MaxZScore.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 leading-relaxed">
                <p>
                  <strong>Mother:</strong> {childData.motherHeight} {childData.motherHeightUnit}
                </p>
                <p>
                  <strong>Father:</strong> {childData.fatherHeight} {childData.fatherHeightUnit}
                </p>
              </div>
            </div>
          </div>
          )}

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleNewCalculation}
                className="w-full btn-primary text-sm py-2"
              >
                New Calculation
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full btn-secondary text-sm py-2 inline-flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <Link
                to="/about"
                className="w-full btn-secondary text-sm py-2 text-center block"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">Medical Disclaimer</p>
                <p>
                  This tool is for educational purposes only and should not replace professional medical advice. 
                  Always consult with a healthcare provider for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
