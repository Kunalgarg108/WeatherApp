import { useState } from 'react'
import './index.css';
import Weather from './componenets/Weather';
import FivedayForcast from './componenets/FivedayForcast';
function App() {
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

  return (
    <div className='App'>
      <Weather setCoordinates={setCoordinates}/>
      <FivedayForcast lat={coordinates.lat} lon={coordinates.lon} />
    </div>
  )
}

export default App
