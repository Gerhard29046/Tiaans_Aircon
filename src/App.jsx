import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import OurWork from '@/pages/OurWork';
import Tips from '@/pages/Tips';
import TipDetail from '@/pages/TipDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Admin from '@/pages/Admin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/our-work" element={<OurWork />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/tips/:slug" element={<TipDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
