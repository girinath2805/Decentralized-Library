import './App.css'
import { ThemeProvider } from './components/theme-provider'
import Hero from './components/Hero'
import ConnectWalletButton from './components/ConnectWalletButton'

function App() {

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
