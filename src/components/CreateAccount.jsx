import styles from './Login.module.css';
import { auth, createUserWithEmailAndPassword, db, setDoc, doc } from './firebaseConfig.jsx';
import { useState } from 'react';

export function CreateAccount( {showAviso, setShowAviso} ) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nome, setNome] = useState('');
    const [filial, setFilial] = useState('');
    const [cargo, setCargo] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert('As senhas não são iguais, confira e tente novamente');
            return;
        }
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
            setShowAviso(true);
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
                <input id='emailCreateAcc' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='' required />
                <label htmlFor='emailCreateAcc'>Email</label>
                <input id='nomeCreateAcc' type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder='' required />
                <label htmlFor='nomeCreateAcc'>Nome</label>
                <select value={filial} onChange={(e) => setFilial(e.target.value)} placeholder='' required >
                    <option value=''>Selecione sua filial</option>
                    <option value='Pelotas'>Pelotas</option>
                    <option value='Cassino'>Cassino</option>
                    <option value='Laranjal'>Laranjal</option>
                </select>
                <input id='cargoCreateAcc' type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder='' required />
                <label htmlFor='cargoCreateAcc'>Cargo</label>
                <input id='passwordCreateAcc' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='' required />
                <label htmlFor='passwordCreateAcc'>Senha</label>
                <input id='passwordConfirmCreateAcc' type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder='' required />
                <label className={styles.passwordConfirmLabel} htmlFor='passwordConfirmCreateAcc'>Confirme a senha</label>
                <button type="submit">Criar conta</button>
            </form>
        </div>
    )
}
