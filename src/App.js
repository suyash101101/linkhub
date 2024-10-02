import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateLinkHub from './components/CreateLinkHub';
import Profile from './components/Profile';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-linkhub" element={<CreateLinkHub />} />
        {/* Dynamic route to handle any username */}
        <Route path="/:username" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;





