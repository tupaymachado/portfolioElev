import styles from './AvisoCreateAcc.module.css';
import { useState } from 'react';

export function Aviso({ setShowAviso, showAviso, aviso }) {
    return (
        <div className={`${styles.avisoContainer} ${showAviso ? styles.avisoContainerShow : ''}`}>
            <p>{aviso}</p>
            <button onClick={() => setShowAviso(false)}>Fechar</button>
        </div>
    )
}