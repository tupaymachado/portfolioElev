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
import { Login } from './components/Login.jsx'
import { Logout } from './components/Logout.jsx'
import { auth, onAuthStateChanged } from './components/firebaseConfig.jsx'
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  const [precos, setPrecos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [foraPromos, setForaPromos] = useState([]);

  const [mostrarPrecos, setMostrarPrecos] = useState(true);
  const [mostrarPromos, setMostrarPromos] = useState(false);
  const [mostrarForaPromos, setMostrarForaPromos] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  if (user === null) {
    return <Login />;
  }

  return (
    <div>
      <div className='wrapper'>
        <div className="sidebar">
          <Logo />
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
          <div className='topo'>
            <SearchBar
              precos={precos}
              setPrecos={setPrecos}
              promos={promos}
              setPromos={setPromos}
              foraPromos={foraPromos}
              setForaPromos={setForaPromos}
            />
            <Logout />
          </div>
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
