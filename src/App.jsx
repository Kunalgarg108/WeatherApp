import { useState } from 'react'
import './index.css';
import Weather from './componenets/Weather';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Weather/>
    </div>
  )
}

export default App
