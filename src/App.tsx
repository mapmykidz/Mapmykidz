// React import not needed with JSX transform; remove to satisfy TS unused warning
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { InputPage } from './pages/InputPage'
import { ResultsPage } from './pages/ResultsPage'
import { AboutPage } from './pages/AboutPage'
import { FAQPage } from './pages/FAQPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </Layout>
  )
}

export default App
