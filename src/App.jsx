import { useState } from 'react'
import './index.css';
import Weather from './componenets/Weather';
import FivedayForcast from './componenets/FivedayForcast';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Weather/>
      <FivedayForcast />
    </div>
  )
}

export default App
