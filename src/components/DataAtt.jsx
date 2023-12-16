import styles from './DataAtt.module.css';
import { realtime, ref, onValue } from './firebaseConfig.jsx';
import { useState, useEffect } from 'react';

export function DataAtt() {
    const [dataAtt, setDataAtt] = useState(null);

    useEffect(() => {
        const dataAttRef = ref(realtime, 'dataAtt');

        // Configurando um ouvinte para atualizações em tempo real
        const unsubscribe = onValue(dataAttRef, (snapshot) => {
            const dataAtt = new Date(snapshot.val());
            setDataAtt(dataAtt.toLocaleDateString('pt-BR'));
        });

        // Retornando uma função de limpeza para desligar o ouvinte
        return () => unsubscribe();
    }, []);

    return (
        <div className={styles.DataAtt}>
            <h4>Última atualização:</h4>
            <p>{dataAtt ? dataAtt : 'Carregando...'}</p>
        </div>
    )
}