import './App.css'
import { ThemeProvider } from './components/theme-provider'
import ConnectWalletButton from './components/ConnectWalletButton'
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import BookPage from './pages/BookPage'

function App() {

  return (
    <>
      <ThemeProvider>
        <div>
          <ConnectWalletButton/>
          <BrowserRouter>
            <Routes>
              <Route path='/upload' element={<UploadPage/>}/>
              <Route path='/books' element={<BookPage/>}/>
              <Route path='/*' element={<HomePage/>}/>
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
