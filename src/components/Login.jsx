import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from './firebaseConfig.jsx';
import styles from './Login.module.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
        }
    };

    function forgotPassword(email) { //crie uma função para recuperar a senha com sendPasswordResetEmail(auth, email)
        sendPasswordResetEmail(auth, email)
    }


    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Login</button>
                <button type="button" onClick={() => forgotPassword(email)}>Esqueci a senha</button>
            </form>
        </div>
    );
}