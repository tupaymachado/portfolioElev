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
            setDataAtt(dataAtt.toLocaleDateString('pt-BR'));
        }

        getDataAtt();
    }, []);

    return (
        <div className={styles.DataAtt}>
            <h4>Última atualização:</h4>
            <p>{dataAtt ? dataAtt : 'Carregando...'}</p>
        </div>
    )
}