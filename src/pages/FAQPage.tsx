import React, { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Shield, AlertTriangle, Calculator, TrendingUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqData: FAQItem[] = [
    // Getting Started
    {
      category: "Getting Started",
      question: "Do I need to create an account?",
      answer: "No account required! Simply enter your child's information and get instant results. No registration, no passwords, no personal data collection. All calculations are performed locally on your device."
    },
    {
      category: "Getting Started",
      question: "What age ranges does this tool support?",
      answer: "Birth to 20 years: WHO standards (0-2 years) for height, weight, and weight-for-length; CDC standards (2-20 years) for height, weight, and BMI. Mid-parental height available for 2+ years."
    },
    {
      category: "Getting Started",
      question: "How do I use this tool?",
      answer: "Enter your child's information (birth date, gender, height, weight) and parental heights. Click 'Calculate' for instant results with percentiles, Z-scores, and growth charts. Download PDF reports to share with healthcare providers."
    },

    // Using & Understanding
    {
      category: "Using & Understanding",
      question: "What's the difference between WHO and CDC standards?",
      answer: "WHO standards (0-2 years) show how children should grow under optimal conditions. CDC standards (2-20 years) show how children actually grow based on US population data. Both are medically recognized worldwide."
    },
    {
      category: "Using & Understanding",
      question: "How do I measure my child accurately?",
      answer: "Height: no shoes, standing straight. Weight: minimal clothing. Length (infants): lying down, legs straight. Use exact age in months for children under 2 years."
    },
    {
      category: "Using & Understanding",
      question: "What's the difference between height and length?",
      answer: "Length is measured lying down for children under 2 years (WHO standards). Height is measured standing up for children 2+ years (CDC standards). This difference ensures accurate comparisons with age-appropriate growth standards."
    },
    {
      category: "Using & Understanding",
      question: "How do I understand the percentile results?",
      answer: "Percentiles show how your child compares to others the same age and gender: 3rd percentile means only 3% of children are smaller, 50th percentile is average, 97th percentile means only 3% of children are larger."
    },
    {
      category: "Using & Understanding",
      question: "What are Z-scores and why are they important?",
      answer: "Z-scores (Standard Deviation Scores) measure how many standard deviations your child's measurement is from the average. A Z-score of 0 means average, +1 means 1 standard deviation above average, -1 means 1 below. Z-scores provide precise growth assessment and are used by healthcare professionals to identify growth patterns that may need attention."
    },
    {
      category: "Using & Understanding",
      question: "Why do I need parental heights?",
      answer: "Parental heights are used to calculate your child's genetic potential (mid-parental height) and target ranges. Genetic potential accounts for roughly 80% of the variation in height between people. This shows if growth aligns with genetic potential, not just population averages. Gender differences are automatically accounted for."
    },

    // Privacy & Technical
    {
      category: "Privacy & Technical",
      question: "Is my child's data stored?",
      answer: "No, we do not store any personal information. All calculations are performed locally in your browser, and no data is transmitted to our servers. Your privacy is our top priority."
    },
    {
      category: "Privacy & Technical",
      question: "Can I share results with my doctor?",
      answer: "Yes! You can download a PDF report of your results to share with healthcare providers. This includes all measurements, percentiles, Z-scores, growth charts, and interpretations for professional review."
    },
    {
      category: "Privacy & Technical",
      question: "How often should I measure my child?",
      answer: "For routine monitoring: every 3-6 months for children under 2 years, every 6-12 months for older children. Measure more frequently if there are concerns or during rapid growth periods. Always use consistent measurement techniques."
    },

    // Medical & Safety
    {
      category: "Medical & Safety",
      question: "When should I be concerned about my child's growth?",
      answer: "Consult your healthcare provider if: measurements are below 3rd or above 97th percentile, sudden changes in growth patterns, child stops growing for 6+ months, or any concerns about development."
    },
    {
      category: "Medical & Safety",
      question: "Can this tool tell me if my child has a growth problem?",
      answer: "No, this tool cannot diagnose medical conditions. It's for educational purposes only. Only healthcare professionals can diagnose growth disorders or medical conditions."
    },
    {
      category: "Medical & Safety",
      question: "What if my child's measurements are outside normal ranges?",
      answer: "Don't panic - many healthy children fall outside the 'normal' ranges. Focus on growth patterns over time rather than single measurements. Consult your healthcare provider if measurements are consistently below 3rd or above 97th percentile, or if you have concerns about your child's development."
    },
    {
      category: "Medical & Safety",
      question: "Can I use this for adopted children?",
      answer: "The mid-parental height calculation requires biological parent heights. For adopted children, focus on the growth charts and percentiles rather than target height predictions. The standard growth percentiles are still valuable for monitoring growth."
    },
    {
      category: "Medical & Safety",
      question: "How accurate are these calculations?",
      answer: "Our calculations use the same LMS method and official WHO/CDC data as healthcare professionals. Accuracy depends on precise measurements and correct age input. For children under 2 years, use exact age in months. The tool provides estimates for educational purposes and should not replace professional medical assessment."
    }
  ]

  const categories = [...new Set(faqData.map(item => item.category))]

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about using MapMyKidz. Can't find what you're looking for? 
          <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium"> Contact us</a>.
        </p>
      </div>

      {/* Quick Links */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      {categories.map((category) => (
        <div key={category} className="card mb-8">
          <h2 
            id={category.toLowerCase().replace(/\s+/g, '-')}
            className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3"
          >
            {category === "Getting Started" && <Calculator className="w-6 h-6 text-primary-600" />}
            {category === "Using & Understanding" && <TrendingUp className="w-6 h-6 text-primary-600" />}
            {category === "Privacy & Technical" && <Shield className="w-6 h-6 text-primary-600" />}
            {category === "Medical & Safety" && <AlertTriangle className="w-6 h-6 text-primary-600" />}
            <span>{category}</span>
          </h2>
          
          <div className="space-y-4">
            {faqData
              .filter(item => item.category === category)
              .map((item) => {
                const globalIndex = faqData.findIndex(faq => faq === item)
                const isOpen = openItems.has(globalIndex)
                
                return (
                  <div key={globalIndex} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <div className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      ))}

      {/* Contact Section */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Learn More About Our Methods
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="card bg-yellow-50 border-yellow-200 mt-8">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Important Reminder</h3>
            <p className="text-gray-700 text-sm">
              This tool is for educational purposes only and should never replace professional medical advice, 
              diagnosis, or treatment. Always consult healthcare providers for medical decisions about your child's health.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
