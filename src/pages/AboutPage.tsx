import React from 'react'
import { Book, Shield, Globe, Calculator, TrendingUp, Users, Info, ExternalLink, Scale, Activity } from 'lucide-react'

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: 'WHO & CDC Standards',
      description: 'Uses official WHO growth standards (0-2 years) and CDC growth charts (2-20 years) with precise LMS calculations.',
    },
    {
      icon: TrendingUp,
      title: 'Z-Scores & Percentiles',
      description: 'Calculates accurate Z-scores and percentiles using the LMS method, the same approach used by healthcare professionals.',
    },
    {
      icon: Users,
      title: 'Height-for-Age Tracking',
      description: 'Monitor height growth using WHO standards (0-2 years) and CDC charts (2-20 years) with mid-parental height estimates.',
    },
    {
      icon: Scale,
      title: 'Weight-for-Age Tracking',
      description: 'Monitor weight growth using WHO Weight-for-age standards (0-2 years) and CDC Weight-for-age charts (2-20 years).',
    },
    {
      icon: Activity,
      title: 'BMI-for-Age Analysis',
      description: 'Calculate Body Mass Index using WHO BMI-for-age standards (0-2 years) and CDC BMI-for-age charts (2-20 years).',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All calculations are performed locally on your device. No data is sent to external servers.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Book className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About MapMyKidz
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A professional-grade growth tracking tool that helps parents monitor their child's height, weight, and BMI 
          using internationally recognized medical standards from WHO and CDC.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="card">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* How It Works */}
      <div className="card mb-12">
        <h2 className="section-title flex items-center space-x-3">
          <Info className="w-6 h-6 text-primary-600" />
          <span>How It Works</span>
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Standards</h3>
            <p className="text-gray-600 mb-3">
              MapMyKidz uses internationally recognized growth standards for three key measurements:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Height-for-age:</strong> WHO standards (0-2 years) and CDC charts (2-20 years)
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Weight-for-age:</strong> WHO standards (0-2 years) and CDC charts (2-20 years)
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>BMI-for-age:</strong> WHO standards (0-2 years) and CDC charts (2-20 years)
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">LMS Method</h3>
            <p className="text-gray-600 mb-3">
              We use the LMS (Lambda-Mu-Sigma) method for precise calculations:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>L (Lambda):</strong> Skewness parameter</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>M (Mu):</strong> Mean value</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>S (Sigma):</strong> Coefficient of variation</div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Height-for-Age Measurements</h3>
            <p className="text-gray-600 mb-3">
              Height-for-age charts track how your child's height compares to other children of the same age and gender:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>WHO Height-for-age (0-2 years):</strong> Based on healthy, breastfed children from diverse populations</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>CDC Height-for-age (2-20 years):</strong> Based on large-scale surveys of US children</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Units:</strong> Height is measured in centimeters (cm) or inches (in)</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Terminology:</strong> "Length" for children 0-24 months, "Height" for children 25+ months</div>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Mid-Parental Height Calculation</h4>
            <p className="text-gray-600 mb-3">
              Estimates your child's expected adult height based on parental heights:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Boys:</strong> (Mother's height + Father's height + 13 cm) ÷ 2</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Girls:</strong> (Mother's height + Father's height - 13 cm) ÷ 2</div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weight-for-Age Measurements</h3>
            <p className="text-gray-600 mb-3">
              Weight-for-age charts track how your child's weight compares to other children of the same age and gender:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>WHO Weight-for-age (0-2 years):</strong> Based on healthy, breastfed children from diverse populations</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>CDC Weight-for-age (2-20 years):</strong> Based on large-scale surveys of US children</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Units:</strong> Weight is measured in kilograms (kg) or pounds (lb)</div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">BMI-for-Age Analysis</h3>
            <p className="text-gray-600 mb-3">
              Body Mass Index (BMI) is calculated as weight in kilograms divided by height in meters squared:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Formula:</strong> BMI = weight (kg) ÷ height (m)²</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>WHO BMI-for-age (0-2 years):</strong> Standards for healthy growth patterns</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>CDC BMI-for-age (2-20 years):</strong> Charts for monitoring body composition</div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong>Units:</strong> BMI is expressed in kg/m²</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interpreting Results */}
      <div className="card mb-12">
        <h2 className="section-title">Interpreting Results</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Height Interpretation</h3>
            <p className="text-gray-600 mb-3">
              Height percentiles show how your child's height compares to other children of the same age and gender:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Above 90th percentile</div>
                  <div className="text-gray-600">Tall (top 10%)</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">10th-90th percentile</div>
                  <div className="text-gray-600">Normal range (80% of children)</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">3rd-10th percentile</div>
                  <div className="text-gray-600">Below average but normal</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Below 3rd percentile</div>
                  <div className="text-gray-600">May indicate short stature</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weight Interpretation</h3>
            <p className="text-gray-600 mb-3">
              Weight percentiles indicate if your child is underweight, normal weight, or overweight for their age:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Above 95th percentile</div>
                  <div className="text-gray-600">May indicate overweight</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">10th-90th percentile</div>
                  <div className="text-gray-600">Normal weight range</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">5th-10th percentile</div>
                  <div className="text-gray-600">Below average but normal</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Below 5th percentile</div>
                  <div className="text-gray-600">May indicate underweight</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">BMI Interpretation</h3>
            <p className="text-gray-600 mb-3">
              BMI percentiles measure body composition relative to height and age:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Above 95th percentile</div>
                  <div className="text-gray-600">May indicate obesity</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">85th-95th percentile</div>
                  <div className="text-gray-600">May indicate overweight</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">5th-85th percentile</div>
                  <div className="text-gray-600">Normal BMI range</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Below 5th percentile</div>
                  <div className="text-gray-600">May indicate underweight</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Z-Scores</h3>
            <p className="text-gray-600">
              Z-scores show how many standard deviations your child's measurements are from the mean. 
              They're particularly useful for extreme values (below 3rd percentile) and provide 
              more precise measurements than percentiles alone for height, weight, and BMI.
            </p>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="card mb-12">
        <h2 className="section-title flex items-center space-x-3">
          <Globe className="w-6 h-6 text-primary-600" />
          <span>Data Sources</span>
        </h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">
              WHO Child Growth Standards
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Official growth standards from the World Health Organization for children aged 0-2 years.
            </p>
            <a 
              href="https://www.who.int/tools/child-growth-standards" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center space-x-1"
            >
              <span>Visit WHO Growth Standards</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="border-l-4 border-primary-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">
              CDC Growth Charts
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Growth charts from the Centers for Disease Control and Prevention for children aged 2-20 years.
            </p>
            <a 
              href="https://www.cdc.gov/growthcharts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center space-x-1"
            >
              <span>Visit CDC Growth Charts</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Medical Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              MapMyKidz is designed for educational purposes only and should not be used as a substitute 
              for professional medical advice, diagnosis, or treatment. Always consult with a qualified 
              healthcare provider regarding any concerns about your child's growth or development.
            </p>
            <p className="text-gray-700 text-sm">
              If you have concerns about your child's growth, particularly if they fall below the 10th 
              percentile or above the 90th percentile for height, weight, or BMI, or if there are significant 
              changes in growth patterns, please consult with your pediatrician or a pediatric endocrinologist.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
