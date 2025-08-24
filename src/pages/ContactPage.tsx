import React, { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, Info } from 'lucide-react'

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission (replace with actual email service)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help with technical issues, questions, feedback, or suggestions about the app',
      contact: 'support@mapmykidz.com',
      action: 'mailto:support@mapmykidz.com',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600'
    }
  ]

  const faqTopics = [
    {
      title: 'How to use the calculator',
      description: 'Step-by-step guide for entering measurements and interpreting results',
      link: '/faq#getting-started'
    },
    {
      title: 'Understanding growth charts',
      description: 'Learn how to read and interpret the growth charts and percentiles',
      link: '/faq#using-understanding'
    },
    {
      title: 'Privacy and data security',
      description: 'Information about how we protect your data and privacy',
      link: '/faq#privacy-technical'
    },
    {
      title: 'Medical advice and safety',
      description: 'When to consult healthcare professionals about growth concerns',
      link: '/faq#medical-safety'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about MapMyKidz? We're here to help! Get in touch with our support team 
          or share your feedback to help us improve the application.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="flex justify-center mb-12">
        <div className="max-w-md w-full">
                  {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div key={index} className="card text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {method.description}
                </p>
                <a
                  href={method.action}
                  target={method.action.startsWith('http') ? '_blank' : '_self'}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${method.bgColor} ${method.iconColor} hover:opacity-80`}
                >
                  <span>{method.contact}</span>
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div className="card mb-12">
        <h2 className="section-title flex items-center space-x-3">
          <Send className="w-6 h-6 text-primary-600" />
          <span>Send us a Message</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="">Select a subject</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="General Question">General Question</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-vertical"
              placeholder="Please describe your question, feedback, or issue in detail..."
            />
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">Thank you! Your message has been sent successfully.</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">Sorry, there was an error sending your message. Please try again.</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 py-3 inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* FAQ Quick Links */}
      <div className="card mb-12">
        <h2 className="section-title flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-primary-600" />
          <span>Quick Help</span>
        </h2>
        
        <p className="text-gray-600 mb-6">
          Before contacting us, you might find answers to common questions in our FAQ section:
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {faqTopics.map((topic, index) => (
            <a
              key={index}
              href={topic.link}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="card">
        <h2 className="section-title flex items-center space-x-3">
          <Info className="w-6 h-6 text-primary-600" />
          <span>Additional Information</span>
        </h2>
        
        <div className="space-y-4 text-gray-600">
          <p>
            <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days.
          </p>
          <p>
            <strong>Medical Advice:</strong> MapMyKidz is for educational purposes only. For medical concerns about your child's growth, 
            please consult with a healthcare professional.
          </p>
          <p>
            <strong>Privacy:</strong> All information you share with us is kept confidential and used only to provide support and improve our services.
          </p>
        </div>
      </div>
    </div>
  )
}
