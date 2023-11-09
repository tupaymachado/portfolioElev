import styles from './DataAtt.module.css';
import { collection, doc, getDoc, db } from './firebaseConfig.jsx';
import { realtime, ref, get } from './firebaseConfig.jsx';
import { useState, useEffect } from 'react';

export function DataAtt() {
    const [dataAtt, setDataAtt] = useState(null);

    useEffect(() => {
        async function getDataAtt() {
            const dataAttRef = ref(realtime, 'dataAtt');
            const dataAttSnapshot = await get(dataAttRef);
            const dataAtt = new Date(dataAttSnapshot.val());
            console.log(dataAttSnapshot.val())
            setDataAtt(dataAtt.toLocaleDateString('pt-BR'));
            /* const portfolioCollection = collection(db, 'portfolio');
            const docRef = doc(portfolioCollection, 'dataAtualizacao');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dataAtt = new Date(docSnap.data().data.seconds * 1000);
                setDataAtt(dataAtt.toLocaleDateString('pt-BR'));
            } else {
                console.log('No such document!');
            } */
        }

        getDataAtt();
    }, []);

    return (
        <div className={styles.DataAtt}>
            <h4>Data da última atualização:</h4>
            <p>{dataAtt ? dataAtt : 'Carregando...'}</p>
        </div>
    )
}