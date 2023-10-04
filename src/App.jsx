import { useState } from 'react'
import { XlsxHandling } from './components/XlsxHandling.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { Logo } from './components/Logo.jsx'
import { CsvHandling } from './components/CsvHandling.jsx'
import { EtiquetasPreco } from './components/EtiquetasPreco.jsx'
import { EtiquetasPromo } from './components/EtiquetasPromo.jsx'
import { AddEtiqueta } from './components/AddEtiqueta.jsx'
import './App.css'

function App() {
  const [precos, setPrecos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [foraPromos, setForaPromos] = useState([]);

  return (
    <>
      <Logo />
      <div className='wrapper'>
        <div className="sidebar">
          <AddEtiqueta />
          <XlsxHandling
            setPrecos={setPrecos}
            setPromos={setPromos}
            setForaPromos={setForaPromos}
          />
          <CsvHandling />
        </div>
        <div className='main'>
          <SearchBar />
          <h1>ETIQUETAS PREÇO:</h1>
          <EtiquetasPreco etiquetas={promos} />
          <h1>ETIQUETAS PROMOÇÃO:</h1>
          <EtiquetasPromo etiquetas={promos} />
        </div>
      </div>
    </>
  )
}

export default App
