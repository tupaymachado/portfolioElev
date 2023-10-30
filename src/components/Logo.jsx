import styles from './Logo.module.css';
import LogoImg from './imgs/GrupoElevato_Logo_RGB_Color.svg';
import { collection, doc, getDoc, db } from './firebaseConfig.jsx';
import { useState, useEffect } from 'react';

export function Logo() {
    const [dataAtt, setDataAtt] = useState(null);

    useEffect(() => {
        async function getDataAtt() {
            const portfolioCollection = collection(db, 'portfolio');
            const docRef = doc(portfolioCollection, 'dataAtualizacao');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dataAtt = new Date(docSnap.data().data.seconds * 1000);
                setDataAtt(dataAtt.toLocaleDateString('pt-BR'));
            } else {
                console.log('No such document!');
            }
        }

        getDataAtt();
    }, []);

    return (
        <div className={styles.logoWrapper}>
            <div className={styles.DataAtt}>
                <h4>Data da última atualização:</h4>
                <p>{dataAtt ? dataAtt : 'Carregando...'}</p>
            </div>
            <img className={styles.logo} src={LogoImg} alt="Grupo Elevato" />
        </div>
    )
}