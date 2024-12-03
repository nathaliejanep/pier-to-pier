// import Decimal from 'decimal.js';
import './App.css';
import Footer from './components/Footer';
import TopNav from './components/TopNav';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <TopNav />
      <div style={{ minHeight: 'calc(100vh - 228px)' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
