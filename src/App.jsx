import { useState } from 'react'
import { XlsxHandling } from './assets/xlsxHandling.jsx'
import { SearchBar } from './assets/SearchBar.jsx'
import { Logo } from './assets/Logo.jsx'
import { CsvHandling } from './assets/CsvHandling.jsx'
import './App.css'


function App() {
  return (
    <>
      <Logo />
      <SearchBar />
      <CsvHandling />
      <XlsxHandling />
    </>
  )
}

export default App
