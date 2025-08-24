# MapMyKidz - Child Growth Tracker

A professional-grade Progressive Web App for tracking child growth using WHO and CDC standards. Calculate percentiles, Z-scores, and mid-parental height with medical-grade accuracy for height, weight, and BMI measurements.

**Medical-Grade Accuracy • Privacy-First Design • Educational Focus**

## ✨ Latest Features

### 🎯 Enhanced Growth Tracking
- **Mid-Parental Height (MPH)**: Calculate expected adult height and genetic target ranges
- **Target Height Ranges**: Boys ±10cm, Girls ±8.5cm from MPH
- **Interactive Growth Charts**: Visual representation with optimal and alert zones
- **Genetic View**: Compare child's growth to genetic potential
- **Standard View**: Compare to population percentiles

### 📊 Advanced Analytics
- **LMS Method**: Medical-grade Z-score calculations using Lambda-Mu-Sigma parameters
- **Precise Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th percentiles
- **Age-Appropriate Metrics**: Weight-for-length (0-2 years), BMI (2-20 years)
- **Growth Velocity**: Track growth patterns over time
- **Health Categories**: Underweight, Normal, Overweight, Obese classifications
- **Medical Interpretations**: Professional-grade growth assessments

### 🎨 Improved User Experience
- **Alert Zone Visualization**: Red dotted lines for areas beyond target range
- **Optimal Zone Display**: Green zones showing healthy growth ranges
- **Responsive Charts**: Interactive growth charts with legend controls
- **PDF Reports**: Comprehensive growth reports with charts and interpretations
- **Multi-Unit Support**: Automatic conversion between metric and imperial units

## 🚀 Core Functionality

### 📈 Growth Metrics Supported

#### Height Tracking
- **Age Range**: 0-20 years (WHO 0-2, CDC 2-20)
- **Units**: Centimeters (cm) and Inches
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **Growth Charts**: Visual representation with percentile curves
- **Mid-Parental Height**: Genetic potential calculations

#### Weight Tracking
- **Age Range**: 0-20 years (WHO 0-2, CDC 2-20)
- **Units**: Kilograms (kg) and Pounds (lb)
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **Weight Charts**: Visual representation with percentile curves

#### Weight-for-Length Tracking (0-2 years)
- **Age Range**: 0-2 years (WHO standards only)
- **Length Range**: 45-110 cm
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **WFL Charts**: Visual representation with percentile curves
- **Health Categories**: Underweight, Normal, Overweight, Obese

#### BMI (Body Mass Index) Tracking (2-20 years)
- **Age Range**: 2-20 years (CDC standards only)
- **Automatic Calculation**: BMI = weight(kg) / height(m)²
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **BMI Charts**: Visual representation with percentile curves
- **Health Categories**: Underweight, Normal, Overweight, Obese

### 🏥 Medical Standards

#### WHO Growth Standards (0-2 years)
- Based on optimal growth conditions
- Diverse international population
- Breastfeeding reference standard
- Official WHO LMS parameters for height, weight, and BMI

#### CDC Growth Charts (2-20 years)  
- Large-scale US population surveys
- Diverse ethnic representation
- Clinically validated
- Official CDC LMS parameters for height, weight, and BMI

#### Calculation Methods
- **Z-Score**: `Z = (measurement/M)^L - 1) / (L × S)` when L ≠ 0
- **Percentile**: Normal distribution CDF conversion
- **Weight-for-Length**: WHO standards for children 0-2 years
- **BMI**: `BMI = weight(kg) / height(m)²` for children 2-20 years
- **Mid-Parental Height**: 
  - Boys: `(Mother + Father + 13) / 2`
  - Girls: `(Mother + Father - 13) / 2`
- **Target Ranges**: Fixed centimeter distances converted to Z-scores

## 🛡️ Privacy & Security

- ✅ **No Data Collection**: No personal information collected
- ✅ **Offline First**: Works without internet connection  
- ✅ **Local Storage**: Data stays on your device
- ✅ **No Analytics**: No tracking or monitoring
- ✅ **Open Source**: Transparent and auditable
- ✅ **Client-Side Only**: All calculations performed locally
- ✅ **PWA Security**: Modern web app security features

## 📱 Technical Features

### Progressive Web App
- **Offline Functionality**: Works without internet connection
- **Installable**: Add to home screen on all devices
- **Fast Loading**: Optimized performance and caching
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Advanced Features
- **PDF Export**: Generate comprehensive growth reports
- **Interactive Charts**: Chart.js powered visualizations
- **Real-time Validation**: Input validation with helpful error messages
- **Multi-Unit Support**: Automatic conversion between metric and imperial units
- **SEO Optimized**: Structured data and meta tags for search engines

## 🎨 User Experience

- **Child-Friendly Design**: Warm colors and intuitive interface
- **Grade 6 Reading Level**: Clear, accessible language
- **Comprehensive Results**: Detailed interpretations and advice for each metric
- **Educational Focus**: Learn about growth standards and percentiles
- **Tabbed Interface**: Easy switching between height, weight, and BMI results
- **Medical Guidance**: Clear advice on when to consult healthcare providers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mapmykidz/Mapmykidz.git
cd MapmyKidz

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

### Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety for medical calculations
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Professional chart visualization
- **Lucide Icons** - Beautiful, consistent icons

### PWA & State
- **Vite PWA** - Service worker and caching
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing

### Data & Calculations
- **WHO Growth Standards** - Official 0-2 year data for height, weight, and BMI
- **CDC Growth Charts** - Official 2-20 year data for height, weight, and BMI
- **LMS Method** - Medical-grade calculation accuracy
- **Date-fns** - Precise age calculations
- **jsPDF & html2canvas** - PDF report generation

### SEO & Performance
- **Structured Data** - Schema.org markup for search engines
- **Meta Tags** - Open Graph and Twitter Card optimization
- **Performance Optimization** - Fast loading and smooth interactions

## 📊 Growth Categories

### Height Categories
- **Short Stature**: Below 3rd percentile
- **Normal Range**: 3rd to 97th percentile
- **Tall Stature**: Above 97th percentile

### Weight Categories
- **Underweight**: Below 5th percentile
- **Normal Weight**: 5th to 85th percentile
- **Overweight**: 85th to 95th percentile
- **Obese**: Above 95th percentile

### Weight-for-Length Categories (0-2 years)
- **Underweight**: Below 3rd percentile
- **Normal Weight**: 3rd to 97th percentile
- **Overweight**: Above 97th percentile

### BMI Categories (2-20 years)
- **Underweight**: Below 5th percentile
- **Normal Weight**: 5th to 85th percentile
- **Overweight**: 85th to 95th percentile
- **Obese**: Above 95th percentile

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## 📋 Medical Disclaimer

⚠️ **Important**: This application is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any concerns about your child's growth or development.

**Key Points:**
- Results are estimates based on statistical models
- Individual growth patterns vary significantly
- Professional medical evaluation is recommended for concerns
- This tool does not establish a doctor-patient relationship

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Guidelines

1. **Medical Accuracy**: All calculations must match official standards
2. **Type Safety**: Use TypeScript for all medical calculations
3. **Testing**: Include tests for calculation functions
4. **Accessibility**: Follow WCAG 2.1 AA guidelines
5. **Performance**: Maintain fast load times and smooth interactions
6. **Data Integrity**: Ensure all growth data matches official WHO/CDC standards
7. **Privacy First**: Maintain no-data-collection policy
8. **Educational Value**: Focus on parent education and understanding

## 📈 Project Status

### ✅ Completed Features
- Medical-grade growth calculations
- Interactive growth charts
- Mid-parental height calculations
- Weight-for-length tracking (0-2 years)
- BMI tracking (2-20 years)
- PDF report generation
- PWA functionality
- SEO optimization
- Responsive design
- Multi-unit support

### 🔄 In Progress
- Legal documentation (Privacy Policy, Terms of Service)
- Medical authority building (endorsements, partnerships)
- User feedback integration
- Performance optimization

### 📋 Planned Features
- Mobile app versions (iOS/Android)
- Multi-language support
- Advanced analytics dashboard
- Healthcare provider portal
- Educational content expansion

## 🏆 Acknowledgments

- **World Health Organization** for growth standards
- **Centers for Disease Control and Prevention** for growth charts
- **Healthcare professionals** who validated our calculations
- **Open source community** for excellent tools and libraries
- **Parents and caregivers** for valuable feedback and testing

## 📞 Support

For questions, feedback, or support:
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check our comprehensive guides
- **Medical Questions**: Consult with healthcare providers

---

**Made with ❤️ for children's health and development**

*MapMyKidz - Professional-grade child growth tracking for parents and healthcare providers*
