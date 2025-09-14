import './styles/App.css';
import Navbar from './components/common/Navbar'; 
import HeroSlider from './components/common/HeroSlider';
import PackagesSection from './components/common/PackagesSection';

function App() {
  return (
    <>
      <Navbar/>
      <HeroSlider/>
      <PackagesSection/>
    </>
  );
}

export default App;