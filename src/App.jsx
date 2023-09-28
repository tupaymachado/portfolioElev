import { useState } from 'react'
import { XlsxHandling } from './components/xlsxHandling.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { Logo } from './components/Logo.jsx'
import { CsvHandling } from './components/CsvHandling.jsx'
import { EtiquetasPreco } from './components/EtiquetasPreco.jsx'
import { EtiquetasPromo } from './components/EtiquetasPromo.jsx'
import './App.css'

function App() {
  const [intersec, setIntersec] = useState([]);

  const handleEtiquetas = (newEtiquetas) => {
    setIntersec(newEtiquetas);
  }

  return (
    <>
      <Logo />
      <SearchBar />
      <CsvHandling />
      <XlsxHandling onEtiquetasChange={handleEtiquetas} />   
{/* Componentes de etiqueta terão renderização apenas quando um botão for clicado
 <EtiquetasPreco etiquetas={intersec} /> */}
      <EtiquetasPromo etiquetas={intersec} />
    </>
  )
}

export default App
