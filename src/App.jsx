import { useState } from 'react'
import { XlsxHandling } from './components/XlsxHandling.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { Logo } from './components/Logo.jsx'
import { CsvHandling } from './components/CsvHandling.jsx'
import { EtiquetasPreco } from './components/EtiquetasPreco.jsx'
import { EtiquetasPromo } from './components/EtiquetasPromo.jsx'
import { AddEtiqueta } from './components/AddEtiqueta.jsx'
import { EtiquetasForaPromo } from './components/EtiquetasForaPromo.jsx'
import './App.css'

function App() {
  const [precos, setPrecos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [foraPromos, setForaPromos] = useState([]);

  const [mostrarPrecos, setMostrarPrecos] = useState(false);
  const [mostrarPromos, setMostrarPromos] = useState(false);
  const [mostrarForaPromos, setMostrarForaPromos] = useState(false);



  return (
    <div>
      <Logo />

      <div className='wrapper'>
        <div className="sidebar">
          <AddEtiqueta />
          <XlsxHandling
            setPrecos={setPrecos}
            setPromos={setPromos}
            setForaPromos={setForaPromos}
            setMostrarPrecos={setMostrarPrecos}
            setMostrarPromos={setMostrarPromos}
            setMostrarForaPromos={setMostrarForaPromos}
          />
          <CsvHandling />
        </div>
        <div className='main'>
          <SearchBar />
          {mostrarPrecos && <EtiquetasPreco etiquetas={precos} />}
          {mostrarPromos && <EtiquetasPromo etiquetas={promos} />}
          {mostrarForaPromos && <EtiquetasForaPromo etiquetas={promos} />}
        </div>
      </div>
    </div>
  )
}

export default App
