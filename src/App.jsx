import { useState } from 'react'
import { XlsxHandling } from './components/xlsxHandling.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { Logo } from './components/Logo.jsx'
import { CsvHandling } from './components/CsvHandling.jsx'
import { EtiquetasPreco } from './components/EtiquetasPreco.jsx'
import './App.css'


function App() {
  return (
    <>
      <Logo />
      <SearchBar />
      <CsvHandling />
      <XlsxHandling />
      <EtiquetasPreco />
    </>
  )
}

export default App
