import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Shield, Smartphone, Globe, Award, Ruler, Scale, Activity } from 'lucide-react'

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Accurate Calculations',
      description: 'WHO and CDC standards with precise Z-score and percentile calculations for Height, Weight, and BMI'
    },
    {
      icon: TrendingUp,
      title: 'Comprehensive Tracking',
      description: 'Track Height, Weight, and Body Composition percentiles individually or together with interactive growth charts'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All data stays on your device. No personal information is sent to external servers'
    },
    {
      icon: Smartphone,
      title: 'Works Offline',
      description: 'Use the app anywhere, anytime - no internet connection required'
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'Based on internationally recognized WHO (0-2 years) and CDC (2-20 years) standards'
    },
    {
      icon: Award,
      title: 'Professional Grade',
      description: 'Same calculations used by healthcare professionals worldwide'
    }
  ]

  const measurementTypes = [
    {
      icon: Ruler,
      title: 'Length/Height-for-Age',
      description: 'Monitor length (0-2 years) and height (2-20 years) percentiles and growth patterns',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600'
    },
    {
      icon: Scale,
      title: 'Weight-for-Age',
      description: 'Track weight-for-age percentiles and growth patterns',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600'
    },
          {
        icon: Activity,
        title: 'Nutritional Assessment',
        description: 'Calculate weight-for-length (0-2 years) and BMI (2-20 years) percentiles',
        color: 'from-primary-500 to-primary-600',
        bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Child Growth Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Track height, weight, and body composition percentiles using WHO and CDC standards. Calculate Z-scores and get professional-grade results with clear interpretations and advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/input"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Calculator className="w-5 h-5" />
              <span>Start Tracking</span>
            </Link>
            <Link
              to="/about"
              className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Measurement Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Growth Measurements We Track
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {measurementTypes.map((type, index) => {
            const Icon = type.icon
            return (
              <div
                key={index}
                className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 h-12 ${type.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${type.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600">
                  {type.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose MapMyKidz?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="card hover:shadow-md transition-shadow duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
      </div>

      {/* How It Works */}
      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Measurements</h3>
            <p className="text-gray-600">
              Select height, weight, and/or body composition for tracking based on your needs
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Details</h3>
            <p className="text-gray-600">
              Input your child's measurements and parent information
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Results</h3>
            <p className="text-gray-600">
              See percentiles, Z-scores, and comprehensive growth analysis
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">View Charts</h3>
            <p className="text-gray-600">
              Visualize growth on interactive charts with clear interpretations
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Tracking?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of parents who trust MapMyKidz for comprehensive child growth monitoring
        </p>
        <Link
          to="/input"
          className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2 w-full sm:w-auto mx-auto"
        >
          <Calculator className="w-5 h-5" />
          <span>Start Tracking Now</span>
        </Link>
      </div>
    </div>
  )
}
