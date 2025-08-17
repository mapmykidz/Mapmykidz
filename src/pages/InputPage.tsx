import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calculator, Baby, Users, AlertCircle, Ruler, Scale, Activity, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { ChildData, Gender, HeightUnit, WeightUnit } from '../types'
import { calculateAge, calculateGrowthResult, calculateMidParentalHeight } from '../utils/calculations'

export const InputPage: React.FC = () => {
  const navigate = useNavigate()
  const { childData, setChildData, setResults, isCalculating, setIsCalculating } = useAppStore()
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

    // Helpers for measurement selection UI
    const selectedMeasurements = (childData.selectedMeasurements ?? []) as ('height' | 'weight' | 'bmi')[]
    const requiresHeight = selectedMeasurements.includes('height') || selectedMeasurements.includes('bmi')
    const requiresWeight = selectedMeasurements.includes('weight') || selectedMeasurements.includes('bmi')

	const toggleMeasurement = (key: 'height' | 'weight' | 'bmi') => {
		const next = new Set(selectedMeasurements)
		if (next.has(key)) {
			next.delete(key)
			// If removing a dependency (height/weight) while BMI is selected, also remove BMI
			if ((key === 'height' || key === 'weight') && next.has('bmi')) {
				next.delete('bmi')
			}
		} else {
			next.add(key)
			// Selecting BMI requires height and weight
			if (key === 'bmi') {
				next.add('height')
				next.add('weight')
			}
		}
		handleInputChange('selectedMeasurements' as any, Array.from(next))
	}

  const handleInputChange = (field: keyof ChildData, value: any) => {
    setChildData({ [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Clear measurements error when user selects measurements
    if (field === 'selectedMeasurements' && value && value.length > 0) {
      setErrors(prev => ({ ...prev, measurements: '' }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field)
  }

  const validateField = (field: string) => {
    const newErrors = { ...errors }
    const data = childData as any
    const requiresHeight = (data.selectedMeasurements?.includes('height')) || (data.selectedMeasurements?.includes('bmi'))

    switch (field) {
      case 'gender':
        if (!data.gender) {
          newErrors.gender = 'Please select your child\'s gender'
        }
        break
      case 'dateOfBirth':
        if (!data.dateOfBirth) {
          newErrors.dateOfBirth = 'Please enter your child\'s date of birth'
        } else {
          const today = new Date()
          const birthDate = new Date(data.dateOfBirth)
          const age = calculateAge(data.dateOfBirth, today.toISOString().split('T')[0])
          
          if (birthDate > today) {
            newErrors.dateOfBirth = 'Date of birth cannot be in the future'
          } else if (age.ageInMonths > 240) { // 20 years
            newErrors.dateOfBirth = 'This calculator is designed for children 0-19 years old'
          } else if (age.ageInDays < 0) {
            newErrors.dateOfBirth = 'Please enter a valid date'
          }
        }
        break
      case 'measurementDate':
        if (!data.measurementDate) {
          newErrors.measurementDate = 'Please enter the measurement date'
        } else if (data.dateOfBirth && new Date(data.measurementDate) < new Date(data.dateOfBirth)) {
          newErrors.measurementDate = 'Measurement date cannot be before birth date'
        }
        break
      case 'height':
        if (data.selectedMeasurements?.includes('height')) {
        if (!data.height || data.height <= 0) {
          newErrors.height = 'Please enter a valid height'
                  } else {
            const minHeight = data.heightUnit === 'cm' ? 30 : 12 // 30cm or 12 inches
            const maxHeight = data.heightUnit === 'cm' ? 220 : 87 // 220cm or 87 inches
          if (data.height < minHeight || data.height > maxHeight) {
            newErrors.height = `Height must be between ${minHeight} and ${maxHeight} ${data.heightUnit}`
            }
          }
        }
        break
      case 'weight':
        if (data.selectedMeasurements?.includes('weight')) {
          if (!data.weight || data.weight <= 0) {
            newErrors.weight = 'Please enter a valid weight'
                      } else {
              const minWeight = data.weightUnit === 'kg' ? 1.5 : 3.3 // 1.5kg or 3.3 lbs
              const maxWeight = data.weightUnit === 'kg' ? 200 : 440
            if (data.weight < minWeight || data.weight > maxWeight) {
              newErrors.weight = `Weight must be between ${minWeight} and ${maxWeight} ${data.weightUnit}`
            }
          }
        }
        break
      case 'motherHeight':
        if (requiresHeight) {
        if (!data.motherHeight || data.motherHeight <= 0) {
          newErrors.motherHeight = 'Please enter mother\'s height'
        } else {
          const minHeight = data.motherHeightUnit === 'cm' ? 120 : 47 // 120cm or 47 inches
          const maxHeight = data.motherHeightUnit === 'cm' ? 220 : 87 // 220cm or 87 inches
          if (data.motherHeight < minHeight || data.motherHeight > maxHeight) {
            newErrors.motherHeight = `Height must be between ${minHeight} and ${maxHeight} ${data.motherHeightUnit}`
            }
          }
        }
        break
      case 'fatherHeight':
        if (requiresHeight) {
        if (!data.fatherHeight || data.fatherHeight <= 0) {
          newErrors.fatherHeight = 'Please enter father\'s height'
        } else {
          const minHeight = data.fatherHeightUnit === 'cm' ? 120 : 47 // 120cm or 47 inches
          const maxHeight = data.fatherHeightUnit === 'cm' ? 220 : 87 // 220cm or 87 inches
          if (data.fatherHeight < minHeight || data.fatherHeight > maxHeight) {
            newErrors.fatherHeight = `Height must be between ${minHeight} and ${maxHeight} ${data.fatherHeightUnit}`
            }
          }
        }
        break
    }

    setErrors(newErrors)
  }

  const validateForm = (): boolean => {
    // Check if at least one measurement is selected
    if (!childData.selectedMeasurements || childData.selectedMeasurements.length === 0) {
      setErrors({ measurements: 'Please select at least one measurement type' })
      return false
    }

    const fields = ['gender', 'dateOfBirth', 'measurementDate'] as string[]
    if (childData.selectedMeasurements?.includes('height')) {
      fields.push('height', 'motherHeight', 'fatherHeight')
    }
    if (childData.selectedMeasurements?.includes('weight')) {
      fields.push('weight')
    }

    // Mark all as touched so inline messages show
    setTouched(prev => {
      const next = { ...prev }
      fields.forEach(f => { next[f] = true })
      return next
    })

    const data = childData as any
    const newErrors: Record<string, string> = {}

    // gender
    if (!data.gender) {
      newErrors.gender = 'Please select your child\'s gender'
    }

    // dateOfBirth
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Please enter your child\'s date of birth'
    } else {
      const today = new Date()
      const birthDate = new Date(data.dateOfBirth)
      const age = calculateAge(data.dateOfBirth, today.toISOString().split('T')[0])
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future'
      } else if (age.ageInMonths > 240) {
        newErrors.dateOfBirth = 'This calculator is designed for children 0-19 years old'
      } else if (age.ageInDays < 0) {
        newErrors.dateOfBirth = 'Please enter a valid date'
      }
    }

    // measurementDate
    if (!data.measurementDate) {
      newErrors.measurementDate = 'Please enter the measurement date'
    } else if (data.dateOfBirth && new Date(data.measurementDate) < new Date(data.dateOfBirth)) {
      newErrors.measurementDate = 'Measurement date cannot be before birth date'
    }

    // height (required only if selected)
    if (data.selectedMeasurements?.includes('height')) {
      if (!data.height || data.height <= 0) {
        newErrors.height = 'Please enter a valid height'
              } else {
          const minHeight = data.heightUnit === 'cm' ? 30 : 12 // 30cm or 12 inches
          const maxHeight = data.heightUnit === 'cm' ? 220 : 87 // 220cm or 87 inches
        if (data.height < minHeight || data.height > maxHeight) {
          newErrors.height = `Height must be between ${minHeight} and ${maxHeight} ${data.heightUnit}`
        }
      }
    }

    // weight (required only if selected)
    if (data.selectedMeasurements?.includes('weight')) {
      if (!data.weight || data.weight <= 0) {
        newErrors.weight = 'Please enter a valid weight'
              } else {
          const minWeight = data.weightUnit === 'kg' ? 1.5 : 3.3 // 1.5kg or 3.3 lbs
          const maxWeight = data.weightUnit === 'kg' ? 200 : 440
        if (data.weight < minWeight || data.weight > maxWeight) {
          newErrors.weight = `Weight must be between ${minWeight} and ${maxWeight} ${data.weightUnit}`
        }
      }
    }

    // motherHeight (required only if height is selected)
    if (data.selectedMeasurements?.includes('height')) {
      if (!data.motherHeight || data.motherHeight <= 0) {
        newErrors.motherHeight = 'Please enter mother\'s height'
      } else {
        const minHeight = data.motherHeightUnit === 'cm' ? 120 : 47
        const maxHeight = data.motherHeightUnit === 'cm' ? 220 : 87
        if (data.motherHeight < minHeight || data.motherHeight > maxHeight) {
          newErrors.motherHeight = `Height must be between ${minHeight} and ${maxHeight} ${data.motherHeightUnit}`
        }
      }
    }

    // fatherHeight (required only if height is selected)
    if (data.selectedMeasurements?.includes('height')) {
      if (!data.fatherHeight || data.fatherHeight <= 0) {
        newErrors.fatherHeight = 'Please enter father\'s height'
      } else {
        const minHeight = data.fatherHeightUnit === 'cm' ? 120 : 47
        const maxHeight = data.fatherHeightUnit === 'cm' ? 220 : 87
        if (data.fatherHeight < minHeight || data.fatherHeight > maxHeight) {
          newErrors.fatherHeight = `Height must be between ${minHeight} and ${maxHeight} ${data.fatherHeightUnit}`
        }
      }
    }

    // Commit errors once
    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsCalculating(true)

    try {
      const completeChildData = childData as ChildData
      const age = calculateAge(completeChildData.dateOfBirth, completeChildData.measurementDate)
      const growthResult = calculateGrowthResult(completeChildData, age)
      const midParentalHeight = calculateMidParentalHeight(completeChildData)

      const results = {
        childData: completeChildData,
        age,
        growthResult,
        midParentalHeight,
        chartData: [] // Will be populated by chart component
      }

      setResults(results)
      navigate('/results')
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors({ general: 'An error occurred during calculation. Please check your inputs.' })
    } finally {
      setIsCalculating(false)
    }
  }

  const getFieldError = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : ''
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Child Growth Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Enter your child's information to calculate growth percentiles and Z-scores
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{errors.general}</p>
          </div>
        )}

        {/* Measurement Selection */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="section-title mb-0">Select Measurements</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                type="button" 
                className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 hover:border-primary-300 transition-colors" 
                onClick={() => handleInputChange('selectedMeasurements' as any, ['height','weight','bmi'])}
              >
                Select all
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors" 
                onClick={() => handleInputChange('selectedMeasurements' as any, [])}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Height card */}
            <button
              type="button"
              role="checkbox"
              aria-checked={selectedMeasurements.includes('height')}
              onClick={() => toggleMeasurement('height')}
              className={`text-left p-4 rounded-xl border transition shadow-sm hover:shadow ${selectedMeasurements.includes('height') ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Ruler className={`w-5 h-5 ${selectedMeasurements.includes('height') ? 'text-primary-600' : 'text-gray-600'}`} />
                  <div className="font-medium">Height</div>
                </div>
                {selectedMeasurements.includes('height') && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
              </div>
              <p className="text-sm text-gray-600 mt-2">Monitor length/height growth percentiles and track linear development patterns.</p> 
            </button>

            {/* Weight card */}
            <button
              type="button"
              role="checkbox"
              aria-checked={selectedMeasurements.includes('weight')}
              onClick={() => toggleMeasurement('weight')}
              className={`text-left p-4 rounded-xl border transition shadow-sm hover:shadow ${selectedMeasurements.includes('weight') ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Scale className={`w-5 h-5 ${selectedMeasurements.includes('weight') ? 'text-primary-600' : 'text-gray-600'}`} />
                  <div className="font-medium">Weight</div>
                </div>
                {selectedMeasurements.includes('weight') && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
              </div>
              <p className="text-sm text-gray-600 mt-2">Track weight gain patterns and assess nutritional status by age.</p>
            </button>

            {/* BMI card */}
            <button
              type="button"
              role="checkbox"
              aria-checked={selectedMeasurements.includes('bmi')}
              onClick={() => toggleMeasurement('bmi')}
              className={`text-left p-4 rounded-xl border transition shadow-sm hover:shadow ${selectedMeasurements.includes('bmi') ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className={`w-5 h-5 ${selectedMeasurements.includes('bmi') ? 'text-primary-600' : 'text-gray-600'}`} />
                  <div className="font-medium">Growth</div>
                </div>
                {selectedMeasurements.includes('bmi') && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
              </div>
              <p className="text-sm text-gray-600 mt-2">Assess body composition and healthy weight relative to height</p>
              {selectedMeasurements.includes('bmi') && (
                <p className="text-xs text-primary-700 mt-1">Height and Weight auto-selected.</p>
              )}
            </button>
          </div>
          
          {/* Error message for measurement selection */}
          {errors.measurements && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.measurements}</p>
            </div>
          )}
        </div>

          {/* Child Information (only shown when at least one measurement is selected) */}
          {selectedMeasurements.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Baby className="w-6 h-6 text-primary-600" />
            <h2 className="section-title mb-0">Child Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex space-x-4">
                {['male', 'female'].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={childData.gender === gender}
                      onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                      onBlur={() => handleBlur('gender')}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="capitalize text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
              {getFieldError('gender') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('gender')}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={childData.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                onBlur={() => handleBlur('dateOfBirth')}
                className={`input-field ${getFieldError('dateOfBirth') ? 'border-red-500' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {getFieldError('dateOfBirth') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('dateOfBirth')}</p>
              )}
            </div>

            {/* Measurement Date */}
            <div>
              <label htmlFor="measurementDate" className="block text-sm font-medium text-gray-700 mb-2">
                Measurement Date *
              </label>
              <input
                type="date"
                id="measurementDate"
                value={childData.measurementDate || ''}
                onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                onBlur={() => handleBlur('measurementDate')}
                className={`input-field ${getFieldError('measurementDate') ? 'border-red-500' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {getFieldError('measurementDate') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('measurementDate')}</p>
              )}
            </div>

            {/* Child Height (only if required by selection) */}
            {requiresHeight && (
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Height *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="height"
                  value={childData.height || ''}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                  onBlur={() => handleBlur('height')}
                  placeholder={childData.heightUnit === 'cm' ? 'Height in cm' : 'Height in inches'}
                  step="0.1"
                  className={`input-field flex-1 ${getFieldError('height') ? 'border-red-500' : ''}`}
                />
                <select
                  value={childData.heightUnit}
                  onChange={(e) => handleInputChange('heightUnit', e.target.value as HeightUnit)}
                  className="input-field w-20"
                >
                  <option value="cm">cm</option>
                  <option value="inches">in</option>
                </select>
              </div>
              {getFieldError('height') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('height')}</p>
              )}
            </div>
            )}

            {/* Child Weight (only if required by selection) */}
            {requiresWeight && (
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Weight *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    id="weight"
                    value={childData.weight || ''}
                    onChange={(e) => handleInputChange('weight' as any, parseFloat(e.target.value))}
                    onBlur={() => handleBlur('weight')}
                    placeholder={childData.weightUnit === 'kg' ? 'Weight in kg' : 'Weight in lb'}
                    step="0.1"
                    className={`input-field flex-1 ${getFieldError('weight') ? 'border-red-500' : ''}`}
                  />
                  <select
                    value={childData.weightUnit || 'kg'}
                    onChange={(e) => handleInputChange('weightUnit' as any, e.target.value as WeightUnit)}
                    className="input-field w-20"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
                {getFieldError('weight') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('weight')}</p>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Parent Heights (only if height-related metrics are selected) */}
        {(selectedMeasurements.includes('height') || selectedMeasurements.includes('bmi')) && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-primary-600" />
            <h2 className="section-title mb-0">Parent Heights</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Parent heights are used to calculate mid-parental height and target height range
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mother's Height */}
            <div>
              <label htmlFor="motherHeight" className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Height *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="motherHeight"
                  value={childData.motherHeight || ''}
                  onChange={(e) => handleInputChange('motherHeight', parseFloat(e.target.value))}
                  onBlur={() => handleBlur('motherHeight')}
                  placeholder={childData.motherHeightUnit === 'cm' ? 'Height in cm' : 'Height in inches'}
                  step="0.1"
                  className={`input-field flex-1 ${getFieldError('motherHeight') ? 'border-red-500' : ''}`}
                />
                <select
                  value={childData.motherHeightUnit}
                  onChange={(e) => handleInputChange('motherHeightUnit', e.target.value as HeightUnit)}
                  className="input-field w-20"
                >
                  <option value="cm">cm</option>
                  <option value="inches">in</option>
                </select>
              </div>
              {getFieldError('motherHeight') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('motherHeight')}</p>
              )}
            </div>

            {/* Father's Height */}
            <div>
              <label htmlFor="fatherHeight" className="block text-sm font-medium text-gray-700 mb-2">
                Father's Height *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="fatherHeight"
                  value={childData.fatherHeight || ''}
                  onChange={(e) => handleInputChange('fatherHeight', parseFloat(e.target.value))}
                  onBlur={() => handleBlur('fatherHeight')}
                  placeholder={childData.fatherHeightUnit === 'cm' ? 'Height in cm' : 'Height in inches'}
                  step="0.1"
                  className={`input-field flex-1 ${getFieldError('fatherHeight') ? 'border-red-500' : ''}`}
                />
                <select
                  value={childData.fatherHeightUnit}
                  onChange={(e) => handleInputChange('fatherHeightUnit', e.target.value as HeightUnit)}
                  className="input-field w-20"
                >
                  <option value="cm">cm</option>
                  <option value="inches">in</option>
                </select>
              </div>
              {getFieldError('fatherHeight') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('fatherHeight')}</p>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isCalculating}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3 min-w-48"
          >
            <Calculator className="w-5 h-5" />
            <span>{isCalculating ? 'Calculating...' : 'Calculate Growth'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
