import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { ThemeProvider } from './components/theme-provider'
import Hero from './components/Hero'
import ConnectWalletButton from './components/ConnectWalletButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider>
        <div>
          <ConnectWalletButton/>
          <Hero/>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
