import { useState, useEffect } from 'react'
import { XlsxHandling } from './components/XlsxHandling.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { Logo } from './components/Logo.jsx'
import { CsvHandling } from './components/CsvHandling.jsx'
import { EtiquetasPreco } from './components/EtiquetasPreco.jsx'
import { EtiquetasPromo } from './components/EtiquetasPromo.jsx'
import { AddEtiqueta } from './components/AddEtiqueta.jsx'
import { EtiquetasForaPromo } from './components/EtiquetasForaPromo.jsx'
import { DataAtt } from './components/DataAtt.jsx'
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
      <div className='wrapper'>
        <div className="sidebar">
          <DataAtt />
          <AddEtiqueta
            precos={precos}
            setPrecos={setPrecos}
            promos={promos}
            setPromos={setPromos}
          />
          <XlsxHandling
            setPrecos={setPrecos}
            setPromos={setPromos}
            setForaPromos={setForaPromos}
            setMostrarPrecos={setMostrarPrecos}
            setMostrarPromos={setMostrarPromos}
            setMostrarForaPromos={setMostrarForaPromos}
            mostrarPrecos={mostrarPrecos}
            mostrarPromos={mostrarPromos}
            mostrarForaPromos={mostrarForaPromos}
          />
          <CsvHandling />
        </div>
        <div className='main'>
          <Logo />
          <SearchBar
            precos={precos}
            setPrecos={setPrecos}
            promos={promos}
            setPromos={setPromos}
          />
          {mostrarPrecos && <EtiquetasPreco
            etiquetas={precos}
            setEtiquetas={setPrecos}
          />}
          {mostrarPromos && <EtiquetasPromo 
          etiquetas={promos} 
          setEtiquetas={setPromos}
          />}
          {mostrarForaPromos && <EtiquetasForaPromo 
          etiquetas={foraPromos} 
          setEtiquetas={setForaPromos}
          />}
        </div>
      </div>
    </div>
  )
}

export default App
