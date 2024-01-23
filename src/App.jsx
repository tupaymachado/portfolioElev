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
import { auth, onAuthStateChanged, doc, getDoc, db, set } from './components/FirebaseConfig.jsx'
import { Aviso } from './components/AvisoCreateAcc.jsx'
import { SolicitacaoAmostras } from './components/SolicitacaoAmostras.jsx'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [showAviso, setShowAviso] = useState(false);
  const [aviso, setAviso] = useState('');

  const [precos, setPrecos] = useState([]);
  const [promos, setPromos] = useState([]);
  const [foraPromos, setForaPromos] = useState([]);

  const [mostrarPrecos, setMostrarPrecos] = useState(true);
  const [mostrarPromos, setMostrarPromos] = useState(false);
  const [mostrarForaPromos, setMostrarForaPromos] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        let uid = currentUser.uid;
        setUser(currentUser);
        const userDocRef = doc(db, 'users', uid);
        console.log(uid);
        getDoc(userDocRef).then((docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            console.log("No such document!"); //Configurar mensagem de erro
          }
        });
      }
    });

    return unsubscribe;
  }, []);

  if (user === null || user.isApproved === false) { //caso o usuário ainda não esteja aprovado, abra um alert avisando-o sobre isso

    return (
      <>
        <Aviso
          aviso={aviso}
          setShowAviso={setShowAviso}
          showAviso={showAviso}
        />
        <Login
          aviso={aviso}
          setAviso={setAviso}
          setShowAviso={setShowAviso}
          showAviso={showAviso}
          user={user}
          setUser={setUser}
        />
      </>
    )
  }

  if (user.isApproved === true) {
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
              user={user}
            />
            <CsvHandling
              user={user}
            />
            <SolicitacaoAmostras use={user}/>
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
              user={user}
              etiquetas={precos}
              setEtiquetas={setPrecos}
            />}
            {mostrarPromos && <EtiquetasPromo
              user={user}
              etiquetas={promos}
              setEtiquetas={setPromos}
            />}
            {mostrarForaPromos && <EtiquetasForaPromo
              user={user}
              etiquetas={foraPromos}
              setEtiquetas={setForaPromos}
            />}
          </div>
        </div>
      </div>
    )
  }
}

export default App
