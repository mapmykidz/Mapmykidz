# MapMyKidz - Child Growth Tracker

A professional-grade Progressive Web App for tracking child growth using WHO and CDC standards. Calculate percentiles, Z-scores, and mid-parental height with medical-grade accuracy for height, weight, and BMI measurements.

## Features

### 🎯 Core Functionality
- **WHO & CDC Standards**: Uses official growth data (WHO 0-2 years, CDC 2-20 years)
- **Multi-Metric Tracking**: Height, Weight, and BMI calculations with percentile rankings
- **Precise Calculations**: LMS method for accurate Z-scores and percentiles
- **Mid-Parental Height**: Calculates expected adult height and target ranges
- **Interactive Charts**: Visual growth charts with child's data plotted across all metrics
- **Flexible Measurements**: Choose which metrics to calculate (height, weight, BMI)

### 📊 Growth Metrics Supported

#### Height Tracking
- **Age Range**: 0-20 years (WHO 0-2, CDC 2-20)
- **Units**: Centimeters (cm) and Inches
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **Growth Charts**: Visual representation with percentile curves

#### Weight Tracking
- **Age Range**: 0-20 years (WHO 0-2, CDC 2-20)
- **Units**: Kilograms (kg) and Pounds (lb)
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **Weight Charts**: Visual representation with percentile curves

#### BMI (Body Mass Index) Tracking
- **Age Range**: 0-20 years (WHO 0-2, CDC 2-20)
- **Automatic Calculation**: BMI = weight(kg) / height(m)²
- **Percentiles**: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
- **Z-Score Calculation**: Medical-grade accuracy using LMS method
- **BMI Charts**: Visual representation with percentile curves
- **Health Categories**: Underweight, Normal, Overweight, Obese

### 📱 Technical Features  
- **Progressive Web App**: Works offline, installable on all devices
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Privacy First**: All data stays on your device
- **Medical Grade**: Same calculations used by healthcare professionals
- **PDF Export**: Generate and download comprehensive growth reports
- **Multi-Unit Support**: Automatic conversion between metric and imperial units

### 🎨 User Experience
- **Child-Friendly Design**: Warm colors and intuitive interface
- **Grade 6 Reading Level**: Clear, accessible language
- **Comprehensive Results**: Detailed interpretations and advice for each metric
- **Educational**: Learn about growth standards and percentiles
- **Tabbed Interface**: Easy switching between height, weight, and BMI results
- **Real-time Validation**: Input validation with helpful error messages

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mapmykidz

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

## Tech Stack

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

## Medical Standards

### WHO Growth Standards (0-2 years)
- Based on optimal growth conditions
- Diverse international population
- Breastfeeding reference standard
- Official WHO LMS parameters for height, weight, and BMI

### CDC Growth Charts (2-20 years)  
- Large-scale US population surveys
- Diverse ethnic representation
- Clinically validated
- Official CDC LMS parameters for height, weight, and BMI

### Calculation Methods
- **Z-Score**: `Z = (measurement/M)^L - 1) / (L × S)` when L ≠ 0
- **Percentile**: Normal distribution CDF conversion
- **BMI**: `BMI = weight(kg) / height(m)²`
- **Mid-Parental Height**: 
  - Boys: `(Mother + Father + 13) / 2`
  - Girls: `(Mother + Father - 13) / 2`

### Growth Categories
- **Height**: Short stature, Normal, Tall stature
- **Weight**: Underweight, Normal, Overweight, Obese
- **BMI**: Underweight, Normal weight, Overweight, Obese

## Privacy & Security

- ✅ **No Data Collection**: No personal information collected
- ✅ **Offline First**: Works without internet connection  
- ✅ **Local Storage**: Data stays on your device
- ✅ **No Analytics**: No tracking or monitoring
- ✅ **Open Source**: Transparent and auditable
- ✅ **Client-Side Only**: All calculations performed locally

## Medical Disclaimer

⚠️ **Important**: This application is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any concerns about your child's growth or development.

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Guidelines

1. **Medical Accuracy**: All calculations must match official standards
2. **Type Safety**: Use TypeScript for all medical calculations
3. **Testing**: Include tests for calculation functions
4. **Accessibility**: Follow WCAG 2.1 AA guidelines
5. **Performance**: Maintain fast load times and smooth interactions
6. **Data Integrity**: Ensure all growth data matches official WHO/CDC standards

## Acknowledgments

- World Health Organization for growth standards
- Centers for Disease Control and Prevention for growth charts
- Healthcare professionals who validated our calculations
- Open source community for excellent tools and libraries

---

**Made with ❤️ for children's health and development**
