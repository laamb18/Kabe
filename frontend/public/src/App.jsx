import './styles/App.css';
import Navbar from './components/common/Navbar'; 
import HeroSlider from './components/common/HeroSlider';
import PackagesSection from './components/common/PackagesSection';
import ProductsSection from './components/common/ProductsSection';

function App() {
  return (
    <>
      <Navbar/>
      <HeroSlider/>
      <PackagesSection/>
      <ProductsSection/>
    </>
  );
}

export default App;