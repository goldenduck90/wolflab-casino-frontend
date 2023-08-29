import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import Home from './pages/home';
import Coinflip from './pages/coinflip';
import DiceGame from './pages/dice';
import Staking from './pages/staking';
import Header from './components/header';
import SideBar from './components/sidebar';
// import Empty from './pages/empty';
import Mint from './pages/mint';

import './assets/styles.scss';
import { ProgramProvider } from './utils/ProgramProvider';
import { Web3Provider } from './utils/Web3Provider';

function App() {
  return (
    <Web3Provider>
      <ProgramProvider>
        <Header />
        <SideBar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/coinflip" element={<Coinflip />} />
            <Route path="/dice" element={<DiceGame />} />
            <Route path="/mint" element={<Mint />} />
          </Routes>
        </Router>
        {/* </DatabaseProvider> */}
      </ProgramProvider>
    </Web3Provider>
  );
}

export default App;
