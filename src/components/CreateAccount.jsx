import styles from './Login.module.css';
import { auth, createUserWithEmailAndPassword, db, setDoc, doc } from './firebaseConfig.jsx';
import { useState } from 'react';

export function CreateAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [filial, setFilial] = useState('');
    const [cargo, setCargo] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                nome: nome,
                filial: filial,
                cargo: cargo,
                isApproved: false,
                isAdmin: false,
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
            <form onSubmit={(e) => handleSubmit(e)} className={styles.loginForm}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='' required />
                <label>Email</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder='' required />
                <label>Nome</label>
                <div>
                    <select value={filial} onChange={(e) => setFilial(e.target.value)} placeholder='' required >
                        <option value=''>Selecione</option>
                        <option value='Pelotas'>Pelotas</option>
                        <option value='Cassino'>Cassino</option>
                        <option value='Laranjal'>Laranjal</option>
                    </select>
                    <label className={styles.labelFilial}>Filial</label>
                </div>
                <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder='' required />
                <label>Cargo</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='' required />
                <label>Senha</label>
                <button type="submit">Criar conta</button>
            </form>
        </div>
    )
}
