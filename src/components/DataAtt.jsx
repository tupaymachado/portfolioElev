import styles from './dataAtt.module.css';
import { collection, doc, getDoc, db } from './firebaseConfig.jsx';
import { useState, useEffect } from 'react';

export function DataAtt() {
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
        <div className={styles.DataAtt}>
            <h3>Data da última atualização:</h3>
            <p>{dataAtt ? dataAtt : 'Carregando...'}</p>
        </div>
    )
}