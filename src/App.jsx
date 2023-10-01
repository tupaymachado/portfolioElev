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

  const handlePrecos = (precos) => {
    setPrecos(precos);
  }

  const handlePromos = (promos) => {
    setPromos(promos);
  }

  const handleForaPromos = (foraPromos) => {
    setForaPromos(foraPromos);
  }

  return (
    <>
      <Logo />
      <SearchBar />
      <CsvHandling />
      <XlsxHandling
        onEtiquetasPreco={handlePrecos}
        onEtiquetasPromo={handlePromos}
        onEtiquetasForaPromo={handleForaPromos}
      />
      {/* Componentes de etiqueta terão renderização apenas quando um botão for clicado
 <EtiquetasPreco etiquetas={intersec} /> */}
      <EtiquetasPromo etiquetas={promos} />
    </>
  )
}

export default App
