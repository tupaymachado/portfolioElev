import { useState } from 'react'
import { XlsxHandling } from './components/XlsxHandling.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { Logo } from './components/Logo.jsx'
import { CsvHandling } from './components/CsvHandling.jsx'
import { EtiquetasPreco } from './components/EtiquetasPreco.jsx'
import { EtiquetasPromo } from './components/EtiquetasPromo.jsx'
import './App.css'

function App() {
  const [precos, setPrecos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [foraPromos, setForaPromos] = useState([]);

  return (
    <>
      <Logo />
      <SearchBar />
      <CsvHandling />
      <XlsxHandling
        setPrecos={setPrecos}
        setPromos={setPromos}
        setForaPromos={setForaPromos}
      />
      <h1>ETIQUETAS PREÇO:</h1>
      <EtiquetasPreco etiquetas={promos} />
      <h1>ETIQUETAS PROMOÇÃO:</h1>
      <EtiquetasPromo etiquetas={promos} />
    </>
  )
}

export default App
