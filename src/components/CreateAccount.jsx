import styles from './CreateAccount.module.css';
import { auth, createUserWithEmailAndPassword } from './firebaseConfig.jsx';
import { useState } from 'react';

export function CreateAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await firestore.collection('users').doc(userCredential.user.uid).set({
                email: email,
                isApproved: false,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.iconBg}>
            </div>
            <p>Crie sua conta</p>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='' required />
                <label>Email</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='' required />
                <label>Senha</label>
                <button type="submit">Criar conta</button>
            </form>
        </div>
    )
}
